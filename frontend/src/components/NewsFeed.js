// src/components/NewsFeed.js
import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import CreatePostDialog from "./CreatePostDialog";
import PostCard from "./PostCard";
import SearchIcon from "@mui/icons-material/Search";

const NewsFeed = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [lostItems, setLostItems] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const fetchLostItems = async () => {
    try {
      const response = await axios.get("/api/lostandfound");
      setLostItems(response.data);
    } catch (error) {
      console.error("Error fetching lost items:", error);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  const handleTextFieldClick = () => {
    setOpenDialog(true);
    setIsEditing(false);
    setPostToEdit(null);
  };

  const handleEditPost = (post) => {
    console.log("Editing post:", post);
    setPostToEdit(post);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  const filteredItems = lostItems.filter(
    (item) =>
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.petCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ mt: 20 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          LOST AND FOUND
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchQuery} // Bind the value to the search state
          onChange={handleSearchChange} // Update state on change
          sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
          InputProps={{
            endAdornment: (
              <Button>
                <SearchIcon />
              </Button>
            ),
          }}
        />
      </Grid>

      <Grid
        container
        justifyContent="center"
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          placeholder="Have you found someone's pet? Or did you lose a pet?"
          onClick={handleTextFieldClick}
          sx={{
            maxWidth: 600,
            mb: 5,
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        />
      </Grid>

      <CreatePostDialog
        open={openDialog}
        setOpen={setOpenDialog}
        fetchLostItems={fetchLostItems}
        postToEdit={postToEdit}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setPostToEdit={setPostToEdit}
      />

      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        {filteredItems.map((item) => (
          <Grid item key={item.id} sx={{ width: "100%", maxWidth: 600 }}>
            <PostCard
              item={item}
              fetchLostItems={fetchLostItems}
              onEdit={handleEditPost}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NewsFeed;
