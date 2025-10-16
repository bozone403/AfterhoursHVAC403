import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Fallback static posts for when API is not available
const fallbackPosts = [
  {
    id: 1,
    title: 'How to Prepare Your Furnace for Winter',
    slug: 'prepare-furnace-winter',
    createdAt: '2023-10-12T00:00:00Z',
    excerpt: 'Essential maintenance steps to ensure your heating system runs efficiently and reliably throughout the cold Alberta winter months.',
    tags: 'Furnace Tips, Winter Prep, Maintenance',
    author: 'AfterHours HVAC Team'
  },
  {
    id: 2,
    title: 'Commercial vs Residential HVAC: What\'s the Difference?',
    slug: 'commercial-vs-residential-hvac',
    createdAt: '2023-09-28T00:00:00Z',
    excerpt: 'An in-depth comparison of commercial and residential HVAC systems, including design considerations, complexity, and maintenance requirements.',
    tags: 'Commercial, Residential, System Design',
    author: 'AfterHours HVAC Team'
  }
];

function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/blog/posts');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Use fallback data if API fails
    initialData: fallbackPosts
  });
}

const BlogIndex = () => {
  const { data: blogPosts = [], isLoading, error } = useBlogPosts();
  const [isAdmin, setIsAdmin] = useState(() => {
    // Check if user is admin - simple check for now
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', slug: '', excerpt: '', content: '', tags: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest('POST', '/api/admin/blog/posts', postData);
    },
    onSuccess: () => {
      toast({ title: 'Success!', description: 'Blog post created successfully' });
      setShowCreateDialog(false);
      setNewPost({ title: '', slug: '', excerpt: '', content: '', tags: '' });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create post', variant: 'destructive' });
    },
  });

  const handleCreatePost = () => {
    createPostMutation.mutate({
      ...newPost,
      author: 'AfterHours HVAC Team'
    });
  };

  return (
    <>
      <Helmet>
        <title>HVAC Knowledge Hub - AfterHours HVAC</title>
        <meta name="description" content="Expert HVAC tips, insights, and guides to help you make informed decisions about your heating and cooling systems. Learn about maintenance, efficiency, and more." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-orange-500 text-white">
        <div className="hvac-container py-24">
          {/* Admin Create Button */}
          {isAdmin && (
            <div className="absolute top-4 right-4">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          )}
          
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <span className="text-white text-lg font-bold">📚 HVAC Knowledge Hub</span>
            </div>
            <h1 className="hvac-heading-xl mb-6">Expert HVAC Insights & Tips</h1>
            <p className="hvac-text-xl text-white/90 max-w-3xl mx-auto">Stay informed with the latest HVAC maintenance tips, industry trends, and expert advice from Calgary's trusted heating and cooling professionals.</p>
          </div>
        </div>
      </div>
      
      {/* Blog Grid */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 py-16">
        <div className="hvac-container">
          {isLoading ? (
            <div className="text-center text-gray-600">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="hvac-text-lg">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="hvac-text-lg">Unable to load blog posts. Showing cached content.</p>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post: any) => {
              const postDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              const tags = post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [];
              
              return (
                <div key={post.id} className="hvac-card group hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <Link href={`/blog/${post.slug}`}>
                    <a className="block relative overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </a>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <span>📅 {postDate}</span>
                      <span>•</span>
                      <span>✍️ {post.author}</span>
                    </div>
                    <h2 className="hvac-heading-sm mb-3">
                      <Link href={`/blog/${post.slug}`}>
                        <a className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-orange-500 transition-all">{post.title}</a>
                      </Link>
                    </h2>
                    <p className="hvac-text-base text-gray-700 mb-4">{post.excerpt}</p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag: string, index: number) => (
                          <span key={index} className="text-xs bg-gradient-to-r from-blue-100 to-orange-100 text-blue-800 rounded-full px-3 py-1 font-medium">{tag}</span>
                        ))}
                      </div>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <a className="inline-flex items-center text-blue-600 hover:text-orange-500 transition-colors font-semibold group">
                        Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          {blogPosts.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="hvac-heading-md mb-2">No Blog Posts Yet</h3>
              <p className="hvac-text-lg text-gray-600">Check back soon for expert HVAC tips and insights!</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-500 py-16">
        <div className="hvac-container">
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Stay Updated on HVAC Trends</h2>
              <p className="text-white/90 text-lg">Subscribe to our newsletter for seasonal maintenance tips, industry news, and special offers.</p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl py-4 px-6 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
              />
              <button 
                type="submit"
                className="bg-white text-blue-600 hover:bg-blue-50 py-4 px-8 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-center text-white/70 mt-4">
              🔒 We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      
      {/* Popular Topics */}
      <section className="bg-white py-16">
        <div className="hvac-container">
          <div className="text-center mb-10">
            <h2 className="hvac-heading-lg mb-2">Popular Topics</h2>
            <p className="hvac-text-lg text-gray-600">Explore by category</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#" className="hvac-badge bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transition-all">🔥 Furnaces</a>
            <a href="#" className="hvac-badge bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:shadow-lg transition-all">❄️ Air Conditioning</a>
            <a href="#" className="hvac-badge bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg transition-all">🔧 Maintenance</a>
            <a href="#" className="hvac-badge bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg transition-all">⚡ Energy Efficiency</a>
            <a href="#" className="hvac-badge bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg transition-all">🏢 Commercial HVAC</a>
            <a href="#" className="hvac-badge bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg transition-all">🔍 Troubleshooting</a>
            <a href="#" className="hvac-badge bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:shadow-lg transition-all">💨 Indoor Air Quality</a>
            <a href="#" className="hvac-badge bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:shadow-lg transition-all">🍂 Seasonal Tips</a>
          </div>
        </div>
      </section>

      {/* Admin Create Post Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={newPost.title}
                onChange={(e) => {
                  setNewPost({ ...newPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '') });
                }}
                placeholder="Post title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input
                value={newPost.slug}
                onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                placeholder="post-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <Textarea
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Brief summary"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content (Markdown supported)</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Full post content"
                rows={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <Input
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="Furnace Tips, Winter, Maintenance"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreatePost} disabled={createPostMutation.isPending} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogIndex;
