
🗑️ A simple CLI tool to safely delete one or more Supabase storage buckets along with all their contents.

## 📦 Installation

Run directly with `npx` (no install required):

```bash

npx delete-supabase-bucket my-bucket

```

Or install locally:

```bash

npm install --save-dev delete-supabase-bucket

```
And use:

```bash

npx delete-bucket my-bucket

```

## 🔧 Setup

Before using the tool, create a `.env` file in your project root:

```env

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

```
> ⚠️ This tool uses the **Service Role Key** to delete objects and buckets. Keep it **secure** and never expose it on the frontend.

## 🚀 Usage

npx delete-supabase-bucket my-bucket

- Replace `my-bucket` with the name of your Supabase bucket.
- Deletes all files and folders in the bucket.
- Deletes the bucket itself.



## 📄 License

MIT