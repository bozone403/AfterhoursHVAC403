import { Link } from 'wouter';
import { CalendarIcon } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "How to Prepare Your Furnace for Winter",
    excerpt: "Essential maintenance steps to ensure your heating system runs efficiently and reliably throughout the cold Alberta winter months.",
    date: "October 15, 2023",
    category: "Maintenance",
    image: "https://pixabay.com/get/gd704f629eabb27369580872fd258f6576303c8ecdd0717d1ee6c79adf02e86831601b543032a352854921cc73aa8a07148b50323133ec3404c13c617365e13bc_1280.jpg",
    slug: "/blog/prepare-furnace-for-winter",
    alt: "Preparing your furnace for the winter season"
  },
  {
    id: 2,
    title: "Commercial vs Residential HVAC: What's the Difference?",
    excerpt: "Understanding the differences between commercial and residential HVAC systems is essential whether you're a business owner or homeowner. This guide breaks down the key distinctions.",
    date: "September 28, 2023",
    category: "Information",
    image: "https://pixabay.com/get/g8457756a5db7297ab98b235fad9a230080e4c4e02905176b9ae9b1d7db3db7a6485f2d07cd9a6c53aa3889459ba300e9f1a91bd7ef37cf93e4c9847e764ca32d_1280.jpg",
    slug: "/blog/commercial-vs-residential-hvac",
    alt: "Commercial and residential HVAC comparison"
  }
];

const BlogPreview = () => {
  return (
    <section className="py-16 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">HVAC Insights</h2>
          <p className="text-muted-text max-w-3xl mx-auto">
            Expert advice, tips, and industry news to help you make informed decisions about your HVAC needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-dark-card border border-gray-700 rounded-xl overflow-hidden service-card">
              <img src={post.image} alt={post.alt} className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <CalendarIcon className="h-4 w-4 text-muted-text mr-1" />
                  <span className="text-xs text-muted-text">{post.date}</span>
                  <span className="mx-2 text-muted-text">•</span>
                  <span className="text-xs text-electric">{post.category}</span>
                </div>
                
                <h3 className="text-xl font-heading font-bold mb-3">
                  <Link href={post.slug} className="hover:text-fire transition-colors">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-muted-text mb-5">{post.excerpt}</p>
                
                <Link 
                  href={post.slug}
                  className="inline-flex items-center text-white hover:text-fire transition-colors font-medium"
                >
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Browse All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
