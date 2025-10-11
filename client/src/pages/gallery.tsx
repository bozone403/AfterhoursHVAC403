import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  MapPin, 
  Star,
  Filter,
  Grid,
  List,
  Sparkles,
  Award,
  Phone
} from "lucide-react";
import { Helmet } from "react-helmet-async";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  location?: string;
  tags: string[];
  rating?: number;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['/api/gallery/services'],
    staleTime: 5 * 60 * 1000,
  });

  const typedGalleryItems = (galleryItems as GalleryItem[]) || [];

  const categories = [
    { id: "all", name: "All Projects", count: typedGalleryItems.length },
    { id: "furnace", name: "Furnace Installation", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "furnace").length },
    { id: "ac", name: "AC Systems", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "ac").length },
    { id: "ductwork", name: "Ductwork", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "ductwork").length },
    { id: "maintenance", name: "Maintenance", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "maintenance").length },
    { id: "commercial", name: "Commercial", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "commercial").length }
  ];

  const filteredItems = selectedCategory === "all" 
    ? typedGalleryItems 
    : typedGalleryItems.filter((item: GalleryItem) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-400 mx-auto mb-6"></div>
          <p className="text-blue-100 text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Service Gallery - AfterHours HVAC | Premium HVAC Installations Calgary</title>
        <meta name="description" content="View our completed HVAC installations, repairs, and maintenance projects. Professional furnace, AC, and ductwork services in Calgary." />
        <meta name="keywords" content="HVAC gallery, furnace installation, AC repair, ductwork, Calgary HVAC services" />
      </Helmet>

      {/* Hero Section - Premium Gradient */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="font-semibold text-sm">Our Premium Work</span>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Showcasing Excellence</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Our Work
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Browse through our completed HVAC projects and see the quality craftsmanship 
              that makes AfterHours HVAC Calgary's trusted heating and cooling experts.
            </p>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 w-fit mx-auto border border-white/20">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`px-6 rounded-lg ${
                  viewMode === "grid" 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700' 
                    : 'text-white hover:bg-white/10'
                }`}
                data-testid="button-grid-view"
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`px-6 rounded-lg ${
                  viewMode === "list" 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700' 
                    : 'text-white hover:bg-white/10'
                }`}
                data-testid="button-list-view"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-white to-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter - Luxury Styling */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Filter className="w-3 h-3 mr-1" />
                Filter by Category
              </Badge>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-2 max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/50 scale-105'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                    data-testid={`filter-${category.id}`}
                  >
                    <div className="font-black">{category.name}</div>
                    <Badge 
                      variant="secondary" 
                      className={`mt-1 text-xs ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white border-white/30'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item: GalleryItem) => (
                <Card 
                  key={item.id} 
                  className="group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-0"
                  data-testid={`gallery-item-${item.id}`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold border-0 shadow-xl"
                      >
                        View Details
                      </Button>
                    </div>
                    {item.rating && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-slate-900">{item.rating}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-black text-slate-900 text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">{item.date}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">{item.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.tags?.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs border-blue-200 text-blue-700 bg-blue-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredItems.map((item: GalleryItem) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all border-0"
                  data-testid={`gallery-item-${item.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-48 h-32 object-cover rounded-xl"
                        />
                        {item.rating && (
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-slate-900">{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-slate-900 text-xl mb-2">{item.title}</h3>
                        <p className="text-slate-600 mb-4">{item.description}</p>
                        <div className="flex items-center gap-6 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">{item.date}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">{item.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.tags?.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs border-blue-200 text-blue-700 bg-blue-50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
                <ImageIcon className="h-16 w-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">No projects found</h3>
              <p className="text-slate-600 text-lg max-w-md mx-auto">
                {selectedCategory === "all" 
                  ? "We're continuously adding new projects to our gallery."
                  : `No projects found in the ${categories.find(c => c.id === selectedCategory)?.name} category.`
                }
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 text-center">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-white/90 text-sm font-medium">Ready to Start Your Project?</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                  Let's Create Your
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    Success Story
                  </span>
                </h2>

                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join our satisfied customers and experience professional HVAC services. 
                  Get a free estimate for your heating and cooling needs.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-105"
                    data-testid="button-cta-quote"
                  >
                    Get Free Quote
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-slate-900 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
                    data-testid="button-cta-call"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call (403) 613-6014
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;