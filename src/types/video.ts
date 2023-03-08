export interface IVideo {
  userId: string;
  title: string;
  description: string;
  imgUrl: string;
  videoUrl: string;
  views: number;
  tags: String[];
  quantityLikes: number;
  quantityDislikes: number;
  likes: string[];
  dislikes: string[];
}
