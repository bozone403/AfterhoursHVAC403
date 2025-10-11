import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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

  return (
    <>
      <Helmet>
        <title>HVAC Knowledge Hub - AfterHours HVAC</title>
        <meta name="description" content="Expert HVAC tips, insights, and guides to help you make informed decisions about your heating and cooling systems. Learn about maintenance, efficiency, and more." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-4">HVAC <span className="text-primary">Knowledge Hub</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">Expert tips, insights, and guides to help you make informed decisions about your heating and cooling systems.</p>
          </div>
        </div>
      </div>
      
      {/* Blog Grid */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-lightgray">
              <i className="fas fa-spinner fa-spin text-2xl mb-4"></i>
              <p>Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center text-lightgray">
              <i className="fas fa-exclamation-triangle text-2xl mb-4 text-yellow-500"></i>
              <p>Unable to load blog posts. Showing cached content.</p>
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
                <div key={post.id} className="bg-darkgray rounded-lg overflow-hidden border border-gray-700 transition-transform hover:transform hover:scale-105">
                  <Link href={`/blog/${post.slug}`}>
                    <a>
                      <img 
                        src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </a>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-lightgray mb-3">
                      <span><i className="far fa-calendar-alt mr-1"></i> {postDate}</span>
                      <span>•</span>
                      <span><i className="far fa-user mr-1"></i> {post.author}</span>
                    </div>
                    <h2 className="text-xl font-bold font-header mb-3">
                      <Link href={`/blog/${post.slug}`}>
                        <a className="hover:text-primary transition-colors">{post.title}</a>
                      </Link>
                    </h2>
                    <p className="text-lightgray mb-4">{post.excerpt}</p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag: string, index: number) => (
                          <span key={index} className="text-xs bg-dark rounded-full px-3 py-1">{tag}</span>
                        ))}
                      </div>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <a className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium">
                        Read Full Article <i className="fas fa-arrow-right ml-2"></i>
                      </a>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          {blogPosts.length === 0 && !isLoading && (
            <div className="text-center text-lightgray py-12">
              <i className="fas fa-newspaper text-4xl mb-4 opacity-50"></i>
              <h3 className="text-xl font-semibold mb-2">No Blog Posts Yet</h3>
              <p>Check back soon for expert HVAC tips and insights!</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-darkgray to-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-darkgray rounded-lg p-8 border border-gray-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-header mb-2">Stay Updated on HVAC Trends</h2>
              <p className="text-lightgray">Subscribe to our newsletter for seasonal maintenance tips, industry news, and special offers.</p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-center text-lightgray mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      
      {/* Popular Topics */}
      <section className="bg-dark py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-header">Popular Topics</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Furnaces</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Air Conditioning</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Maintenance</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Energy Efficiency</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Commercial HVAC</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Troubleshooting</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Indoor Air Quality</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Seasonal Tips</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogIndex;
