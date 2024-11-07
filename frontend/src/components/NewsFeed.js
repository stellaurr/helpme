import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';

const NewsFeed = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/newsfeed');
      console.log(response.data); // Log the response to check the structure
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await axios.put(`http://localhost:8080/api/newsfeed/${currentId}`, formData);
        setSuccessMessage('Article updated successfully!');
      } else if (!isEditing) {
        await axios.post('http://localhost:8080/api/newsfeed', formData);
        setSuccessMessage('Article posted successfully!');
      } else {
        console.error("Error: currentId is undefined for update");
        setSuccessMessage('Update failed. Article ID is missing.');
      }
      setSnackbarOpen(true);
      fetchArticles();
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      setSuccessMessage('Submission failed. Try again.');
      setSnackbarOpen(true);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', author: '' });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleEdit = (article) => {
    setFormData(article);
    setIsEditing(true);
    setCurrentId(article.articleID);
  };

  const handleDeleteClick = (articleID) => {
    if (articleID) {
      setDeleteId(articleID);
      setDeleteDialogOpen(true);
    } else {
      console.error("Error: Delete ID is missing");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      console.error("Error: No delete ID provided");
      setDeleteDialogOpen(false);
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/newsfeed/${deleteId}`);
      setArticles(articles.filter(article => article.articleID !== deleteId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting article:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to format the date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the format further
  };

  return (
    <Box sx={{ padding: 3 }}>

      {/* News Article Form */}
      <Box component="form" onSubmit={handleSubmit} sx={styles.container}>
        <Typography variant="h6">{isEditing ? 'Update Article' : 'Post a News Article'}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="title"
            label="Title"
            variant="outlined"
            sx={styles.textField}
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            name="content"
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            sx={styles.textField}
            value={formData.content}
            onChange={handleChange}
            required
          />
          <TextField
            name="author"
            label="Author"
            variant="outlined"
            sx={styles.textField}
            value={formData.author}
            onChange={handleChange}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={styles.button}>
          {isEditing ? 'Update' : 'Post'}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage}
      />

      {/* News Feed Cards */}
      <Typography variant="h4" sx={{ mb: 3 }}>News Feed</Typography>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.articleID}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{article.title}</Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>{article.content}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="textSecondary">By {article.author}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Posted on: {formatDate(article.createdAt)} {/* Display the formatted date */}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button color="primary" onClick={() => handleEdit(article)}>Edit</Button>
                  <Button color="secondary" onClick={() => handleDeleteClick(article.articleID)}>Delete</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

// CSS styles for centering and formatting
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    margin: '0 auto',
    maxWidth: '600px',
    gap: '16px',
  },
  textField: {
    width: '100%',
    maxWidth: '400px',
    marginBottom: '16px',
  },
  button: {
    marginTop: '16px',
    width: '100%',
    maxWidth: '400px',
  },
};

export default NewsFeed;
