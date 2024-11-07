import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const CreatePostDialog = ({
  open,
  setOpen,
  fetchLostItems,
  postToEdit,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    reportType: "lost",
    dateReported: "",
    lastSeen: "",
    description: "",
    imageData: null,
  });

  useEffect(() => {
    if (isEditing && postToEdit) {
      setFormData({
        reportType: postToEdit.reportType || "",
        petCategory: postToEdit.petCategory || "",
        dateReported: postToEdit.dateReported || "",
        lastSeen: postToEdit.lastSeen || "",
        description: postToEdit.description || "",
        imageData: postToEdit.imageFile || null,
      });
    } else {
      setFormData({
        reportType: "lost",
        petCategory: "",
        dateReported: "",
        lastSeen: "",
        description: "",
        imageData: null,
      });
    }
  }, [isEditing, postToEdit, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, imageData: e.target.files[0] });
  };

  const handleReportTypeChange = (event, newReportType) => {
    if (newReportType) {
      setFormData({ ...formData, reportType: newReportType });
    }
  };

  const handleSubmit = async (e) => {
    if (isEditing) {
      const confirmed = window.confirm(
        "Are you sure you want to update this post?"
      );
      if (!confirmed) {
        return;
      }
    }
    e.preventDefault();

    const dataToSubmit = new FormData();
    dataToSubmit.append("reportType", formData.reportType);
    dataToSubmit.append("petCategory", formData.petCategory);
    dataToSubmit.append("dateReported", formData.dateReported);
    dataToSubmit.append("lastSeen", formData.lastSeen);
    dataToSubmit.append("description", formData.description);

    if (isEditing) {
      if (formData.imageData) {
        dataToSubmit.append("imageFile", formData.imageData);
      }
      if (!postToEdit) {
        console.error("No post to edit. Please select a post.");
        alert("Error: No post to edit. Please try again.");
        return;
      }
    } else {
      if (!formData.imageData) {
        alert("Image file is required when creating a post.");
        return;
      } else {
        dataToSubmit.append("imageFile", formData.imageData);
      }
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `http://localhost:8080/api/lostandfound/${postToEdit.reportID}`,
          dataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Report updated:", response.data);
      } else {
        response = await axios.post(
          `http://localhost:8080/api/lostandfound`,
          dataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Report created:", response.data);
      }

      fetchLostItems();
      setOpen(false);
    } catch (error) {
      console.error("Error updating report:", error);
      alert(
        "Error updating report: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" align="center" fontWeight="bold">
          {isEditing ? "Edit Post" : "Create Post"}
        </Typography>
        <CloseIcon
          onClick={() => setOpen(false)}
          style={{
            cursor: "pointer",
            position: "absolute",
            right: 16,
            top: 16,
          }}
        />
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ToggleButtonGroup
            value={formData.reportType}
            exclusive
            onChange={handleReportTypeChange}
            aria-label="Report Type"
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <ToggleButton
              value="lost"
              aria-label="Lost"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
              }}
            >
              Lost
            </ToggleButton>
            <ToggleButton
              value="found"
              aria-label="Found"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
              }}
            >
              Found
            </ToggleButton>
          </ToggleButtonGroup>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="petCategory"
                label="Pet Type"
                fullWidth
                value={formData.petCategory}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="dateReported"
                label="Date Reported"
                type="date"
                fullWidth
                value={formData.dateReported}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="lastSeen"
                label="Last Seen"
                fullWidth
                value={formData.lastSeen}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              {!isEditing && (
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  required
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#115293",
                      },
                    }}
                  >
                    {isEditing ? "Update Post" : "Create Post"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
