import "next-auth";

declare module "next-auth" {
  interface User {
    avatarUrl?: string | null;
    role?: string;
    departmentId?: number | null;
    departmentName?: string | null;
    departmentSlug?: string | null;
    positionId?: number | null;
    positionName?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatarUrl?: string | null;
      role?: string;
      departmentId?: number | null;
      departmentName?: string | null;
      departmentSlug?: string | null;
      positionId?: number | null;
      positionName?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    avatarUrl?: string | null;
    role?: string;
    departmentId?: number | null;
    departmentName?: string | null;
    departmentSlug?: string | null;
    positionId?: number | null;
    positionName?: string | null;
  }
}
