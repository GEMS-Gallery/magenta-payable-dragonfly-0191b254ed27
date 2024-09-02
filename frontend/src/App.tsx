import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    setLoading(true);
    try {
      await backend.createPost(data.title, data.body, data.author);
      reset();
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <div className="py-8">
        <div className="mb-8 bg-cover bg-center h-64 flex items-center justify-center" style={{backgroundImage: `url(https://images.unsplash.com/photo-1642432556591-72cbc671b707?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUyNzM4MjB8&ixlib=rb-4.0.3)`}}>
          <Typography variant="h2" component="h1" className="text-white text-center font-bold">
            Crypto Blog
          </Typography>
        </div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h2" className="mb-4">
              Recent Posts
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              posts.map((post) => (
                <Card key={Number(post.id)} className="mb-4 hover:shadow-lg transition-shadow duration-300">
                  <CardContent>
                    <Typography variant="h5" component="h3">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                      By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">{post.body}</Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h4" component="h2" className="mb-4">
              Create New Post
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Title"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Author"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                )}
              />
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Body"
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                  />
                )}
              />
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </form>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default App;
