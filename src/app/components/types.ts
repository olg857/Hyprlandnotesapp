export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
};

export type Extension = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
};
