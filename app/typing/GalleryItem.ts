export interface GalleryItem {
  id: string;
  title: string;
  type: "image" | "video"; 
  url: string; 
  thumbnailUrl: string; 
  category: string;
  uploadedAt: string; 
}