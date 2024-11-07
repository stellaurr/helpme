import React from "react";
import {
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
      if (item?.reportID) {
        await axios.delete(
          `http://localhost:8080/api/lostandfound/${item.reportID}`
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

  console.log(item.image);

  const imageSrc = item.image
    ? `data:image/png;base64,${btoa(
        new Uint8Array(item.image).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`
    : null;

  return (
    <Card>
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}
      >
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>

      {imageSrc && (
        <CardMedia
          component="img"
          height="140"
          image={imageSrc}
          alt="Post image"
        />
      )}

      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={item.reportType === "lost" ? "Lost" : "Found"}
            color={item.reportType === "lost" ? "secondary" : "primary"}
          />
          <Chip label={item.petCategory} color="default" />
        </Stack>
        <Typography color="text.secondary">
          Last Seen: {item.lastSeen}
        </Typography>
        <Typography color="text.secondary">
          Date Reported: {item.dateReported}
        </Typography>
        <Typography>{item.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;
