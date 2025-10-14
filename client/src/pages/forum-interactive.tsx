import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { apiFetch } from "@/lib/api";
import { Helmet } from "react-helmet-async";
import { 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  User, 
  Calendar, 
  Eye,
  Pin,
  Lock,
  Reply,
  Heart,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import type { ForumTopic, ForumPost, ForumCategory, ForumLike, User as UserType } from "@/types/shared";

interface ExtendedForumTopic extends ForumTopic {
  likeCount?: number;
  hasLiked?: boolean;
  postCount?: number;
  lastActivity?: string;
  username?: string;
}

interface ExtendedForumPost extends ForumPost {
  likeCount?: number;
  hasLiked?: boolean;
  userName?: string;
}

export default function ForumInteractive() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newTopicUsername, setNewTopicUsername] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostUsername, setNewPostUsername] = useState("");
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"]
  });

  useEffect(() => {
    if (user?.username) {
      setNewTopicUsername(user.username);
      setNewPostUsername(user.username);
    }
  }, [user]);

  const { data: categories = [] } = useQuery<ForumCategory[]>({
    queryKey: ["/api/forum/categories"]
  });

  const { data: topics = [], isLoading: topicsLoading } = useQuery<ExtendedForumTopic[]>({
    queryKey: ["/api/forum/topics", selectedCategory],
    queryFn: async () => {
      const response = await apiFetch(`/api/forum/categories/${selectedCategory}/topics`);
      if (!response.ok) throw new Error("Failed to fetch topics");
      const topics = await response.json();
      
      const enhancedTopics = await Promise.all(topics.map(async (topic: any) => {
        try {
          const likeResponse = await apiFetch(`/api/forum/likes/count?topicId=${topic.id}`);
          const { count } = likeResponse.ok ? await likeResponse.json() : { count: 0 };
          
          let hasLiked = false;
          if (user) {
            const userLikeResponse = await apiFetch(`/api/forum/likes/check?topicId=${topic.id}`);
            if (userLikeResponse.ok) {
              const { hasLiked: liked } = await userLikeResponse.json();
              hasLiked = liked;
            }
          }
          
          return {
            ...topic,
            likeCount: count,
            hasLiked,
            postCount: 0,
            lastActivity: topic.updatedAt,
            username: topic.username || 'Unknown User'
          };
        } catch {
          return {
            ...topic,
            likeCount: 0,
            hasLiked: false,
            postCount: 0,
            lastActivity: topic.updatedAt
          };
        }
      }));
      
      return enhancedTopics;
    },
    enabled: !!selectedCategory
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<ExtendedForumPost[]>({
    queryKey: ["/api/forum/posts", selectedTopic],
    queryFn: async () => {
      if (!selectedTopic) return [];
      
      const response = await apiFetch(`/api/forum/topics/${selectedTopic}/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const posts = await response.json();
      
      const enhancedPosts = await Promise.all(posts.map(async (post: any) => {
        try {
          const likeResponse = await apiFetch(`/api/forum/likes/count?postId=${post.id}`);
          const { count } = likeResponse.ok ? await likeResponse.json() : { count: 0 };
          
          let hasLiked = false;
          if (user) {
            const userLikeResponse = await apiFetch(`/api/forum/likes/check?postId=${post.id}`);
            if (userLikeResponse.ok) {
              const { hasLiked: liked } = await userLikeResponse.json();
              hasLiked = liked;
            }
          }
          
          return {
            ...post,
            likeCount: count,
            hasLiked,
            userName: post.username || `User ${post.userId}`
          };
        } catch {
          return {
            ...post,
            likeCount: 0,
            hasLiked: false,
            userName: post.username || `User ${post.userId}`
          };
        }
      }));
      
      return enhancedPosts;
    },
    enabled: !!selectedTopic
  });

  const createTopicMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; categoryId: number; username?: string }) => {
      const response = await apiRequest("POST", "/api/forum/topics", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      setNewTopicTitle("");
      setNewTopicContent("");
      setNewTopicUsername("");
      setShowNewTopicDialog(false);
      toast({
        title: "Success",
        description: "Topic created successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; topicId: number; username?: string }) => {
      const response = await apiRequest("POST", "/api/forum/posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setNewPostContent("");
      setNewPostUsername("");
      toast({
        title: "Success",
        description: "Post created successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const likeTopicMutation = useMutation({
    mutationFn: async ({ topicId, isLiking }: { topicId: number; isLiking: boolean }) => {
      if (isLiking) {
        const response = await apiRequest("POST", "/api/forum/likes", { topicId });
        return response.json();
      } else {
        const response = await apiRequest("DELETE", `/api/forum/likes?topicId=${topicId}`);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, isLiking }: { postId: number; isLiking: boolean }) => {
      if (isLiking) {
        const response = await apiRequest("POST", "/api/forum/likes", { postId });
        return response.json();
      } else {
        const response = await apiRequest("DELETE", `/api/forum/likes?postId=${postId}`);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const editPostMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      const response = await apiRequest("PUT", `/api/forum/posts/${postId}`, { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setEditingPostId(null);
      setEditingContent("");
      toast({
        title: "Success",
        description: "Post updated successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("DELETE", `/api/forum/posts/${postId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleCreateTopic = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create topics",
        variant: "destructive"
      });
      return;
    }

    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    createTopicMutation.mutate({
      title: newTopicTitle,
      content: newTopicContent,
      categoryId: selectedCategory,
      username: newTopicUsername.trim() || `User ${user.id}`
    });
  };

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create posts",
        variant: "destructive"
      });
      return;
    }

    if (!newPostContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTopic) {
      toast({
        title: "Error",
        description: "No topic selected",
        variant: "destructive"
      });
      return;
    }

    createPostMutation.mutate({
      content: newPostContent,
      topicId: selectedTopic,
      username: newPostUsername.trim() || `User ${user.id}`
    });
  };

  const handleLikeTopic = (topicId: number, currentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like topics",
        variant: "destructive"
      });
      return;
    }

    likeTopicMutation.mutate({
      topicId,
      isLiking: !currentlyLiked
    });
  };

  const handleLikePost = (postId: number, currentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts",
        variant: "destructive"
      });
      return;
    }

    likePostMutation.mutate({
      postId,
      isLiking: !currentlyLiked
    });
  };

  const handleEditPost = (postId: number, currentContent: string) => {
    setEditingPostId(postId);
    setEditingContent(currentContent);
  };

  const handleSaveEdit = (postId: number) => {
    if (!editingContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    editPostMutation.mutate({
      postId,
      content: editingContent
    });
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingContent("");
  };

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePostMutation.mutate(postId);
    }
  };

  const canEditPost = (post: ExtendedForumPost) => {
    if (!user) return false;
    return user.isAdmin || post.userId === user.id;
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'Unknown';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Helmet>
        <title>Interactive Forum - AfterHours HVAC</title>
        <meta name="description" content="Join our interactive HVAC professional forum. Share knowledge, ask questions, and connect with industry experts." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">HVAC Professional Forum</h1>
          <p className="text-lg text-blue-200">Connect with industry professionals, share knowledge, and get expert advice</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden sticky top-4">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-400" />
                  Categories
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    data-testid={`button-category-${category.id}`}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={selectedCategory === category.id 
                      ? "w-full justify-start bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/50 border-0"
                      : "w-full justify-start bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-300"}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedTopic(null);
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {!selectedTopic ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    {categories.find(c => c.id === selectedCategory)?.name || "Topics"}
                  </h2>
                  <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        data-testid="button-new-topic"
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 border-0 transition-all duration-300"
                      >
                        <Plus className="h-4 w-4" />
                        New Topic
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400/30 shadow-2xl">
                      <DialogHeader className="bg-gradient-to-r from-amber-500/20 to-blue-500/20 -m-6 mb-6 p-6 rounded-t-lg border-b border-white/10">
                        <DialogTitle className="text-xl font-bold text-white">Create New Topic</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-200 mb-2">Display Name</label>
                          <Input
                            data-testid="input-topic-username"
                            value={newTopicUsername}
                            onChange={(e) => setNewTopicUsername(e.target.value)}
                            placeholder="Enter your display name for this post..."
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-200 mb-2">Title</label>
                          <Input
                            data-testid="input-topic-title"
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            placeholder="Enter topic title..."
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-200 mb-2">Content</label>
                          <Textarea
                            data-testid="textarea-topic-content"
                            value={newTopicContent}
                            onChange={(e) => setNewTopicContent(e.target.value)}
                            placeholder="Enter topic content..."
                            rows={6}
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            data-testid="button-cancel-topic"
                            variant="outline" 
                            onClick={() => setShowNewTopicDialog(false)}
                            className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                          <Button 
                            data-testid="button-create-topic"
                            onClick={handleCreateTopic}
                            disabled={createTopicMutation.isPending}
                            className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 border-0"
                          >
                            {createTopicMutation.isPending ? "Creating..." : "Create Topic"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {topicsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 animate-pulse">
                        <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topics.map((topic) => (
                      <div 
                        key={topic.id} 
                        data-testid={`card-topic-${topic.id}`}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 hover:bg-white/15 hover:border-amber-400/30 hover:shadow-amber-500/20 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 cursor-pointer" onClick={() => setSelectedTopic(topic.id)}>
                            <div className="flex items-center gap-2 mb-2">
                              {topic.isPinned && <Pin className="h-4 w-4 text-amber-400" data-testid={`icon-pinned-${topic.id}`} />}
                              {topic.isLocked && <Lock className="h-4 w-4 text-red-400" data-testid={`icon-locked-${topic.id}`} />}
                              <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors duration-300" data-testid={`text-topic-title-${topic.id}`}>
                                {topic.title}
                              </h3>
                            </div>
                            <p className="text-blue-200 mb-4 line-clamp-2" data-testid={`text-topic-content-${topic.id}`}>{topic.content}</p>
                            <div className="flex items-center gap-4 text-sm text-blue-300">
                              <div className="flex items-center gap-1" data-testid={`text-user-${topic.id}`}>
                                <User className="h-4 w-4" />
                                User {topic.userId}
                              </div>
                              <div className="flex items-center gap-1" data-testid={`text-date-${topic.id}`}>
                                <Calendar className="h-4 w-4" />
                                {formatDate(topic.createdAt)}
                              </div>
                              <div className="flex items-center gap-1" data-testid={`text-views-${topic.id}`}>
                                <Eye className="h-4 w-4" />
                                {topic.views} views
                              </div>
                              <div className="flex items-center gap-1" data-testid={`text-replies-${topic.id}`}>
                                <MessageSquare className="h-4 w-4" />
                                {topic.postCount || 0} replies
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              data-testid={`button-like-topic-${topic.id}`}
                              variant="ghost"
                              size="sm"
                              className={`flex items-center gap-1 ${topic.hasLiked ? 'text-red-400' : 'text-blue-300'} hover:text-red-400 transition-colors duration-300`}
                              onClick={() => handleLikeTopic(topic.id, topic.hasLiked || false)}
                            >
                              <Heart className={`h-4 w-4 ${topic.hasLiked ? 'fill-current' : ''}`} />
                              <span data-testid={`text-likes-${topic.id}`}>{topic.likeCount || 0}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button 
                    data-testid="button-back-topics"
                    variant="outline" 
                    onClick={() => setSelectedTopic(null)}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    ← Back to Topics
                  </Button>
                  <h2 className="text-2xl font-bold text-white">
                    {topics.find(t => t.id === selectedTopic)?.title}
                  </h2>
                </div>

                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 animate-pulse">
                        <div className="h-4 bg-white/20 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-full mb-1"></div>
                        <div className="h-3 bg-white/20 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post, index) => (
                      <div 
                        key={post.id} 
                        data-testid={`card-post-${post.id}`}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-amber-500/30 text-amber-100 font-semibold border border-amber-400/50">
                              {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white" data-testid={`text-post-author-${post.id}`}>{post.userName}</span>
                                <span className="text-sm text-blue-300" data-testid={`text-post-date-${post.id}`}>
                                  {formatDate(post.createdAt)}
                                </span>
                                {post.isEdited && (
                                  <Badge variant="secondary" className="text-xs bg-blue-500/30 text-blue-100 border-blue-400/50" data-testid={`badge-edited-${post.id}`}>
                                    Edited
                                  </Badge>
                                )}
                                {index === 0 && (
                                  <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-100 border-amber-400/50" data-testid={`badge-original-${post.id}`}>
                                    Original Post
                                  </Badge>
                                )}
                              </div>
                              {canEditPost(post) && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      data-testid={`button-post-menu-${post.id}`}
                                      variant="ghost" 
                                      size="sm"
                                      className="text-white hover:bg-white/10"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
                                    <DropdownMenuItem 
                                      data-testid={`button-edit-post-${post.id}`}
                                      onClick={() => handleEditPost(post.id, post.content)}
                                      className="hover:bg-white/10"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      data-testid={`button-delete-post-${post.id}`}
                                      onClick={() => handleDeletePost(post.id)}
                                      className="text-red-400 hover:bg-red-500/20"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Post
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                            
                            {editingPostId === post.id ? (
                              <div className="space-y-3 mb-4">
                                <Textarea
                                  data-testid={`textarea-edit-post-${post.id}`}
                                  value={editingContent}
                                  onChange={(e) => setEditingContent(e.target.value)}
                                  rows={4}
                                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    data-testid={`button-save-edit-${post.id}`}
                                    size="sm" 
                                    onClick={() => handleSaveEdit(post.id)}
                                    disabled={editPostMutation.isPending}
                                    className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 border-0"
                                  >
                                    {editPostMutation.isPending ? "Saving..." : "Save"}
                                  </Button>
                                  <Button 
                                    data-testid={`button-cancel-edit-${post.id}`}
                                    size="sm" 
                                    variant="outline" 
                                    onClick={handleCancelEdit}
                                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-blue-100 whitespace-pre-wrap mb-4" data-testid={`text-post-content-${post.id}`}>{post.content}</p>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Button
                                data-testid={`button-like-post-${post.id}`}
                                variant="ghost"
                                size="sm"
                                className={`flex items-center gap-1 ${post.hasLiked ? 'text-red-400' : 'text-blue-300'} hover:text-red-400 transition-colors duration-300`}
                                onClick={() => handleLikePost(post.id, post.hasLiked || false)}
                              >
                                <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                                <span data-testid={`text-post-likes-${post.id}`}>{post.likeCount || 0}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-white/10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Reply className="h-5 w-5 text-amber-400" />
                          Reply to Topic
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">Display Name</label>
                            <Input
                              data-testid="input-post-username"
                              value={newPostUsername}
                              onChange={(e) => setNewPostUsername(e.target.value)}
                              placeholder="Enter your display name for this reply..."
                              className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">Reply</label>
                            <Textarea
                              data-testid="textarea-post-content"
                              value={newPostContent}
                              onChange={(e) => setNewPostContent(e.target.value)}
                              placeholder="Enter your reply..."
                              rows={4}
                              className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50"
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              data-testid="button-post-reply"
                              onClick={handleCreatePost}
                              disabled={createPostMutation.isPending}
                              className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 border-0 transition-all duration-300"
                            >
                              {createPostMutation.isPending ? "Posting..." : "Post Reply"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
