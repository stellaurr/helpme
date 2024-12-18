import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion'; // Importing motion
import './Volunteer.css';
import petImg from '../images/petimg.png';  // Adjust the path based on your folder structure
import petImg2 from '../images/example.jpg'; 

const Volunteer = () => {
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [visibleOpportunities, setVisibleOpportunities] = useState(4); // Default: Show 4 cards initially
  const [isExpanded, setIsExpanded] = useState(false); // Track Show More / Show Less state

  const navigate = useNavigate();

  // FAQ data
  const faqData = [
    {
      question: 'What is required to become a volunteer?',
      answer: 'All volunteers must first submit the application form, deposit 1000 (which will be returned after rendering at least 8 hours of volunteer work per month for 6 consecutive months) and attend the orientation.',
    },
    {
      question: 'Can I choose the volunteer opportunities I want to participate in?',
      answer: 'Yes, volunteers have the flexibility to choose from a variety of opportunities listed on our website. You can select the ones that align with your interests and availability.',
    },
    {
      question: 'Do I need prior experience to volunteer?',
      answer: 'No prior experience is necessary for most volunteer opportunities. Training and orientation are provided to ensure that all volunteers are equipped to help effectively.',
    },
    {
      question: 'Can I volunteer with a friend or group?',
      answer: 'Absolutely! We encourage group volunteering, and you can sign up together. Just make sure each individual fills out a separate registration form.',
    },
    {
      question: 'How can I track my volunteer hours?',
      answer: 'We track volunteer hours through our online system. Volunteers can log their hours directly through their profiles, or you can report your hours manually to the volunteer coordinator.',
    }
  ];

  // Fetch volunteer opportunities from the backend
  useEffect(() => {
    const fetchVolunteerOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/volunteer/opportunities');
        setVolunteerOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching volunteer opportunities:', error);
      }
    };
    fetchVolunteerOpportunities();
  }, []);

  // Function to show more or less opportunities
  const handleShowMoreLess = () => {
    if (isExpanded) {
      setVisibleOpportunities(4); // Show 4 opportunities when collapsed
    } else {
      setVisibleOpportunities(volunteerOpportunities.length); // Show all opportunities when expanded
    }
    setIsExpanded((prev) => !prev); // Toggle the state of expanded
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Header Section */}
      <Container maxWidth="lg" sx={{ paddingTop: '4rem', paddingBottom: '1rem' }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <motion.img
              src={petImg}  // Use the imported image reference
              alt="Volunteer"
              className="img-fluid rounded"
              style={{ width: '100%', borderRadius: '20px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Volunteer and Make a Difference for Pets
            </Typography>
            <Typography variant="body1" paragraph>
              Volunteering with pets is a rewarding way to give back and improve the lives of animals in need. From walking dogs at shelters to fostering pets, every moment you spend with them helps build a stronger bond between humans and animals. Whether you're offering companionship, care, or helping them find their forever home, your involvement makes a real difference. Join us in supporting pets who need love, care, and a second chance at life.
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              sx={{
                padding: '6px 16px', // Adds padding around the text
                fontSize: '0.875rem', // Smaller text size
                borderRadius: '18px', // Rounded corners
                boxShadow: 'none', // Removes shadow
                '&:hover': {
                  backgroundColor: '#e1bee7', // Light purple hover effect
                  borderColor: '#9575cd', // Slightly darker border on hover
                },
                width: 'fit-content', // Ensures the button only takes as much space as the text + padding
                display: 'inline-flex', // Makes sure the button size adjusts to content
                alignItems: 'center', // Centers the text vertically
                marginTop: '1rem', // Adds some space between the button and the text above
              }}
              onClick={() => navigate('/book')} // This should work if routes are set correctly
            >
              Book
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ padding: '2rem 0' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: '2rem' }}>
          Volunteer Orientation FAQ
        </Typography>

        {faqData.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            key={index}
          >
            <Accordion
              style={{
                marginBottom: '12px', // Reduced margin
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', // Smaller shadow
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'purple' }} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '5px 18px', // Reduced padding
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1rem', // Fix the font size so it doesn't change when expanded
                    transition: 'font-size 0.3s', // Smooth transition for font size
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ padding: '12px 20px', backgroundColor: '#fafafa' }}>
                <Typography variant="body2" sx={{ color: 'purple' }}> {/* Set color to purple */}
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Container>

      {/* Volunteer Opportunities Section */}
      <Container maxWidth="lg" sx={{ padding: '1rem 0' }}>
        <Typography variant="h4" gutterBottom className="my-5" align="center" sx={{ fontWeight: 'bold', marginBottom: '2rem' }}>
          Volunteer Opportunities
        </Typography>
        <Grid container spacing={4}>
          {volunteerOpportunities.slice(0, visibleOpportunities).map((opportunity) => (
            <Grid item key={opportunity.opportunityID} xs={12} sm={6} md={4} lg={3}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  borderWidth: '1px',
                  boxShadow: 'none', // Removes card shadow
                  borderRadius: '12px', // Custom border radius (adjust the value)
                  display: 'flex', // Use flexbox to control the layout
                  flexDirection: 'column', // Stack children vertically
                }}
              >
                {/* Image Section */}
                <CardMedia
                  component="img"
                  alt={opportunity.title}
                  height="180"
                  image={opportunity.imageUrl || petImg2}  // Use the imported image reference
                  sx={{ objectFit: 'cover' }}  // Keeps the image in uniform size
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {opportunity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {opportunity.description.slice(0, 80)}...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(opportunity.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {opportunity.location}
                  </Typography>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                  <Button
                    size="small"
                    color="primary"
                    sx={{
                      color: 'purple', // Set the text color to purple
                      textTransform: 'none', // Removes uppercase text
                      padding: '6px 16px', // Add padding to the button (vertical, horizontal)
                      marginBottom: '4px', // Reduce bottom margin
                      '&:hover': {
                        color: '#9b59b6',
                        borderRadius: '8px',
                      },
                    }}
                    onClick={() => navigate(`/opportunity/${opportunity.opportunityID}`)}
                  >
                    Read More
                  </Button>

                </CardActions>
              </Card>

            </Grid>
          ))}
        </Grid>

        {/* Show More / Show Less Button */}
        {volunteerOpportunities.length > 4 && (
          <Button
            variant="outlined"
            onClick={handleShowMoreLess}
            sx={{
              marginTop: '2rem',
              display: 'block',  // Center button horizontally
              marginLeft: 'auto',
              marginRight: 'auto',
              borderColor: 'purple',  // Set the border color to purple
              borderRadius: '8px',    // Match border radius to the first button's style
              padding: '6px 16px',    // Match padding to the first button's style
              color: 'purple',        // Set the text color to purple
              textTransform: 'none',  // Removes uppercase text
              marginBottom: '4px',    // Add margin-bottom to match the first button's margin
              '&:hover': {
                borderColor: '#9b59b6', // Set a slightly darker purple for the border on hover
                backgroundColor: '#f0e6f9', // Light purple background on hover
                color: '#9b59b6',      // Set text color to darker purple on hover
              },
              '&.MuiButton-root.Mui-focused': {
                borderColor: 'purple',  // Keep purple border color when focused
              },
              '&.MuiButton-root.Mui-active': {
                borderColor: 'purple',  // Keep purple border color when clicked (active state)
                backgroundColor: 'transparent', // Make sure the background stays transparent
              }
            }}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>


        )}
      </Container>


    </motion.div>
  );
};

export default Volunteer;
