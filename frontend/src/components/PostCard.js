import React from "react";
import {
  Card,
  Box,
  CardContent,
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
    <Card sx={{ height: 400, display: "flex", flexDirection: "column" }}>
      {imageSrc ? (
        <Box
          component="img"
          src={imageSrc}
          alt="Post Image"
          sx={{
            height: 140,
            width: "100%",
            objectFit: "cover",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 140,
            width: "100%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No Image Available
          </Typography>
        </Box>
      )}

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
        <Typography color="primary" fontStyle="italic" noWrap>
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
