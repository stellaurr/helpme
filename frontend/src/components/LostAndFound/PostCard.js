import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const PostCard = ({ item, fetchLostItems, onEdit }) => {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the post?"
    );
    if (!confirmed) return;

    try {
      if (item?.reportid) {
        await axios.delete(
          `http://localhost:8080/api/lostandfound/${item.reportid}`
        );
        alert("Item deleted successfully");
        fetchLostItems();
      } else {
        alert("Item ID is not defined");
      }
    } catch (error) {
      alert(
        "Failed to delete item: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEdit = () => {
    onEdit(item);
  };

  // Handle imageSrc based on byte array or base64 string
  const imageSrc =
    item.image && typeof item.image === "string"
      ? `data:image/png;base64,${item.image}`
      : item.image
      ? `data:image/png;base64,${btoa(
          String.fromCharCode(...new Uint8Array(item.image))
        )}`
      : null;

  return (
    <Card sx={{ height: 500, display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        alt={item.description}
        height="200"
        image={
          item.imageUrl
            ? `http://localhost:8080${item.imageUrl}`
            : "http://localhost:8080/images/default_image.jpg"
        }
        title={item.description}
      />


      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={item.reporttype === "lost" ? "Lost" : "Found"}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: "bold",
              borderWidth: 1.5,
              borderColor: "primary.main",
            }}
          />
          <Chip
            label={item.petcategory}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: "bold",
              borderWidth: 1.5,
              borderColor: "primary.main",
            }}
          />
        </Stack>
        <Typography color="primary" fontSize="12px">
          Last Seen
        </Typography>
        <Typography color="secondary" fontWeight="bold" sx={{ ml: 2 }}>
          {item.lastseen}
        </Typography>
        <Typography color="primary" fontSize="12px">
          Date Reported
        </Typography>
        <Typography color="secondary" fontWeight="bold" sx={{ ml: 2 }}>
          {item.datereported}
        </Typography>
        <br />
        <Typography
          color="primary"
          fontStyle="italic"
          sx={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
          }}
        >
          {item.description}
        </Typography>

      </CardContent>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "8px",
        }}
      >
        <IconButton color="primary" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton color="primary" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Card>
  );
};

export default PostCard;
