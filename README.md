# AxomShiksha Authors Dashboard

A Next.js 16 application for authors to manage educational blog content. This platform allows authors to create, edit, publish, and track their posts with detailed analytics.

## Features

- **Post Management**: Create, edit, and publish blog posts
- **Draft System**: Save posts as drafts for later editing
- **Analytics Dashboard**: Track views, likes, and publication statistics
- **Content Organization**: Categorize posts by class, subject, and chapter
- **Search & Filtering**: Easily find posts by various criteria
- **Responsive Design**: Works seamlessly across devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI, Lucide React Icons
- **State Management**: React Server Components
- **Database**: Supabase
- **Storage**: AWS S3 for MDX content
- **Authentication**: Supabase Auth
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 22+
- npm, yarn, pnpm, or bun
- Supabase account
- AWS account with S3 configured

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd axomshiksha-authors
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your configuration:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  ├── posts/              # Main posts management section
  │   ├── new/            # Create new posts
  │   ├── edit/           # Edit existing posts
  │   └── components/     # Post-related UI components
  ├── post/[slug]/        # Individual post pages
  └── page.tsx            # Author dashboard
components/
  ├── custom/             # Custom UI components
  └── ui/                 # Reusable UI primitives
lib/
  ├── s3.ts               # AWS S3 integration
  └── dynamoClient.ts     # Database client
utils/
  ├── auth/               # Authentication utilities
  ├── post/               # Post management actions
  ├── s3/                 # S3 operations
  └── helpers/            # Helper functions
```

## Key Functionality

### Creating Posts
Authors can create new posts with:
- Title and description
- Class, subject, and chapter information
- Reading time estimation
- Content sections with MDX support

### Managing Posts
- View all posts in a responsive grid
- Filter by status (published/draft), class, subject
- Search by title or content
- Edit or delete existing posts

### Analytics
The dashboard provides insights on:
- Total posts, published posts, and drafts
- Total views and likes across all content
- Recently published posts
- Drafted posts for quick access

## Deployment

To build for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is proprietary and confidential. All rights reserved.

## Support

For support, contact the development team or check the documentation.