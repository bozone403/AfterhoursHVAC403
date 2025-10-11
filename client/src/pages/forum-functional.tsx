import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  Pin, 
  Shield, 
  TrendingUp, 
  Clock,
  Eye,
  Reply,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';

type ForumTopic = {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: number;
  views: number;
  likes: number;
  isSticky: boolean;
  category: string;
};

export default function ForumPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");

  const { data: topics, isLoading, error } = useQuery({
    queryKey: ["/api/forum/topics"],
    enabled: !!user,
  });

  const createTopicMutation = useMutation({
    mutationFn: async (topicData: { title: string; content: string; category: string }) => {
      const response = await apiRequest("POST", "/api/forum/topics", topicData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      setShowNewTopicForm(false);
      setNewTopicTitle("");
      setNewTopicContent("");
      toast({
        title: "Topic Created",
        description: "Your discussion topic has been posted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Topic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTopicMutation = useMutation({
    mutationFn: async ({ topicId, updates }: { topicId: number; updates: Partial<ForumTopic> }) => {
      const response = await apiRequest("PATCH", `/api/forum/topics/${topicId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      toast({
        title: "Topic Updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Updating Topic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: number) => {
      const response = await apiRequest("DELETE", `/api/forum/topics/${topicId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      toast({
        title: "Topic Deleted",
        description: "The discussion has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Deleting Topic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <Helmet>
          <title>HVAC Community Forum - AfterHours HVAC</title>
          <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        </Helmet>
        
        <div className="container mx-auto py-24 px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">HVAC Forum</h1>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-3">Login Required</h2>
                <p className="text-blue-200 mb-6">
                  Access to our community forum is restricted to registered users
                </p>
                <p className="text-blue-100 mb-8">
                  Our forum is available to registered users only. Please log in or create an account
                  to join discussions about HVAC topics, ask questions, and share your experiences.
                </p>
                <Link href="/auth">
                  <Button 
                    data-testid="button-login"
                    className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 border-0 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/50"
                  >
                    Login or Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      <Helmet>
        <title>HVAC Community Forum - AfterHours HVAC</title>
        <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:title" content="HVAC Community Forum - AfterHours HVAC" />
        <meta property="og:description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="HVAC forum, heating cooling discussion, HVAC community, HVAC questions, HVAC advice" />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  HVAC Discussion Forum
                </h1>
                <p className="text-lg text-blue-200">Professional community for HVAC technicians and industry experts</p>
              </div>
              <Button 
                data-testid="button-contact-support"
                className="bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        
          <p className="text-blue-200 mb-8">
            Welcome to the AfterHours HVAC forum! This is where community members can discuss HVAC topics,
            ask questions, share experiences, and get advice from professionals. Please be respectful and
            follow our community guidelines.
          </p>
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-white">Pinned by Admin</h2>
              <Shield className="h-4 w-4 text-yellow-400" />
            </div>
            
            <div className="bg-gradient-to-r from-amber-500/20 to-blue-500/20 backdrop-blur-xl border border-amber-400/30 shadow-2xl rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Pin className="h-4 w-4 text-amber-400" />
                    <h3 className="font-semibold text-white">Welcome to the AfterHours HVAC Forum</h3>
                    <Badge className="bg-amber-500/30 text-amber-100 border-amber-400/50">Pinned</Badge>
                  </div>
                  <p className="text-sm text-blue-200 mb-3">
                    Welcome to our community! Please read our guidelines before posting. Be respectful, stay on topic, 
                    and help create a positive environment for everyone to learn and share knowledge.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-blue-300">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      By Admin
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Posted today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Community Discussions</h2>
            <Button 
              data-testid="button-new-discussion"
              onClick={() => setShowNewTopicForm(!showNewTopicForm)}
              className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 border-0 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Discussion
            </Button>
          </div>

          {showNewTopicForm && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden mb-6">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Start a New Discussion</h3>
                <p className="text-blue-200 mt-1">Share your HVAC questions, experiences, or insights with the community</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <Input
                    data-testid="input-topic-title"
                    placeholder="Discussion title..."
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50 transition-all duration-300"
                  />
                  <Textarea
                    data-testid="textarea-topic-content"
                    placeholder="Share your thoughts, ask questions, or provide helpful information..."
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    rows={4}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-300/50 focus:border-amber-400/50 transition-all duration-300"
                  />
                  <div className="flex gap-2">
                    <Button 
                      data-testid="button-post-discussion"
                      onClick={() => {
                        if (newTopicTitle.trim() && newTopicContent.trim()) {
                          createTopicMutation.mutate({
                            title: newTopicTitle,
                            content: newTopicContent,
                            category: "general"
                          });
                        }
                      }}
                      disabled={createTopicMutation.isPending || !newTopicTitle.trim() || !newTopicContent.trim()}
                      className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/50 border-0 transition-all duration-300"
                    >
                      {createTopicMutation.isPending ? "Posting..." : "Post Discussion"}
                    </Button>
                    <Button 
                      data-testid="button-cancel-topic"
                      variant="outline" 
                      onClick={() => {
                        setShowNewTopicForm(false);
                        setNewTopicTitle("");
                        setNewTopicContent("");
                      }}
                      className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto"></div>
                <p className="text-blue-200 mt-2">Loading discussions...</p>
              </div>
            ) : error ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-center">
                <p className="text-red-400">Error loading forum topics. Please try again.</p>
              </div>
            ) : Array.isArray(topics) && topics.length > 0 ? (
              topics.map((topic: ForumTopic) => (
                <div 
                  key={topic.id} 
                  data-testid={`card-topic-${topic.id}`}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 hover:bg-white/15 hover:border-amber-400/30 hover:shadow-amber-500/20 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {topic.isSticky && <Pin className="h-4 w-4 text-amber-400" data-testid={`icon-pinned-${topic.id}`} />}
                        <h3 className="font-semibold text-white group-hover:text-amber-300 cursor-pointer transition-colors duration-300" data-testid={`text-topic-title-${topic.id}`}>
                          {topic.title}
                        </h3>
                        <Badge variant="secondary" className="bg-blue-500/30 text-blue-100 border-blue-400/50" data-testid={`badge-category-${topic.id}`}>
                          {topic.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-200 mb-3 line-clamp-2" data-testid={`text-topic-content-${topic.id}`}>
                        {topic.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-blue-300">
                        <span data-testid={`text-author-${topic.id}`}>By {topic.author}</span>
                        <span className="flex items-center gap-1" data-testid={`text-date-${topic.id}`}>
                          <Clock className="h-3 w-3" />
                          {new Date(topic.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1" data-testid={`text-replies-${topic.id}`}>
                          <Reply className="h-3 w-3" />
                          {topic.replies} replies
                        </span>
                        <span className="flex items-center gap-1" data-testid={`text-views-${topic.id}`}>
                          <Eye className="h-3 w-3" />
                          {topic.views} views
                        </span>
                        <span className="flex items-center gap-1" data-testid={`text-likes-${topic.id}`}>
                          <ThumbsUp className="h-3 w-3" />
                          {topic.likes}
                        </span>
                      </div>
                    </div>
                    
                    {user && (user as any).isAdmin && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          data-testid={`button-pin-${topic.id}`}
                          size="sm"
                          variant="outline"
                          onClick={() => updateTopicMutation.mutate({
                            topicId: topic.id,
                            updates: { isSticky: !topic.isSticky }
                          })}
                          className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                        >
                          <Pin className="h-3 w-3" />
                        </Button>
                        <Button
                          data-testid={`button-delete-${topic.id}`}
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTopicMutation.mutate(topic.id)}
                          className="bg-white/5 backdrop-blur-sm border-white/20 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-12 text-center">
                <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-200">No discussions yet. Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
