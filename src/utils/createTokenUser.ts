interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string | null;
  role: string;
  profile_picture: string | null;
  devRole: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TokenUser {
  name: string;
  userId: string;
  email: string;
  role: string;
  bio?: string | null;
  devRole: string;
  image?: string;
}

export const createTokenUser = (user: Partial<User>) => {
  return {
    name: user.name,
    userId: user.id,
    email: user.email,
    role: user.role,
    bio: user.bio,
    devRole: user.devRole,
    image: user.profile_picture,
  };
};
