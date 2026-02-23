export type About = {
    id: string;
    name: string;
    title: string;
    tagline: string | null;
    bio: string | null;
    avatar_url: string | null;
    resume_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    email: string | null;
    location: string | null;
    updated_at: string;
};

export type Skill = {
    id: string;
    name: string;
    category: string;
    icon_name: string | null;
    image_url: string | null;
    proficiency: number;
    display_order: number;
    is_visible: boolean;
    is_archived: boolean;
    created_at: string;
};

export type Experience = {
    id: string;
    role: string;
    company: string;
    company_url: string | null;
    type: string | null;
    start_date: string;
    end_date: string | null;
    description: string[];
    tech_stack: string[];
    display_order: number;
    is_visible: boolean;
    is_archived: boolean;
    created_at: string;
};

export type Project = {
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    long_description: string | null;
    image_url: string | null;
    images: string[];
    live_url: string | null;
    github_url: string | null;
    tech_stack: string[];
    tags: string[];
    category: string | null;
    is_featured: boolean;
    display_order: number;
    is_visible: boolean;
    is_archived: boolean;
    created_at: string;
};

export type Certification = {
    id: string;
    title: string;
    issuer: string;
    issue_date: string | null;
    credential_url: string | null;
    badge_url: string | null;
    display_order: number;
    is_visible: boolean;
    is_archived: boolean;
    created_at: string;
};

export type Event = {
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    content: string | null;
    event_date: string;
    type: string | null;
    link_url: string | null;
    image_url: string | null;
    images: string[];
    is_visible: boolean;
    is_featured: boolean;
    is_archived: boolean;
    created_at: string;
};

export type Blog = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    tags: string[];
    is_published: boolean;
    is_visible: boolean;
    is_featured: boolean;
    is_archived: boolean;
    published_at: string | null;
    created_at: string;
};

export type Social = {
    id: string;
    name: string;
    description: string | null;
    url: string;
    image_url: string | null;
    display_order: number;
    is_visible: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
};
