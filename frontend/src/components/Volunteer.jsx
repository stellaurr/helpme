import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, CardActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Volunteer.css';

const Volunteer = () => {
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const faqData = [
    {
      question: 'What is required to become a volunteer?',
      answer: 'All volunteers must first submit the application form, deposit 1000 (which will be returned after rendering at least 8 hours of volunteer work per month for 6 consecutive months) and attend the orientation.',
    },
    // Additional FAQ entries can be added here
  ];

  const navigate = useNavigate();

  // Fetch volunteer opportunities when the component mounts
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
  }, []); // Empty dependency array to only run once when the component mounts

  return (
    <Container maxWidth="lg" className="my-4">
      <br />
      <Grid container spacing={4} alignItems="center">
        <Grid item md={6} className="text-center">
          <img
            src="./images/logo_white.jpg"
            alt="Volunteer"
            className="img-fluid rounded"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>
        <Grid item md={6}>
          <Typography variant="h2" gutterBottom>Volunteer</Typography>
          <Typography variant="body1" gutterBottom>
            When you become a volunteer, you will be assigned a variety of tasks such as dog walking, kennel cleaning, and assisting during outreach programs.
          </Typography>
          <Typography variant="h4" gutterBottom>Schedule a Work</Typography>
          <Button variant="contained" color="primary" size="large" href="/book">
            Book now
          </Button>
        </Grid>
      </Grid>

      <br />
      {/* FAQ Section */}
      <Typography variant="h4" gutterBottom>Volunteer Orientation FAQ</Typography>
      {faqData.map((item, index) => (
        <Accordion key={index} style={{ marginBottom: '10px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
            <Typography variant="h6">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <br />
      <Typography variant="h4" gutterBottom>Available Volunteer Opportunities</Typography>
      <Grid container spacing={3}>
        {volunteerOpportunities.map((opportunity) => (
          <Grid item key={opportunity.opportunityID} md={4} className="my-3">
            <Card variant="outlined" style={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">{opportunity.title}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>{opportunity.description}</Typography>
                <Typography variant="body2" color="text.secondary">Date: {new Date(opportunity.date).toLocaleDateString()}</Typography>
                <Typography variant="body2" color="text.secondary">Location: {opportunity.location}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Hours Worked: {opportunity.hoursWorked !== undefined ? opportunity.hoursWorked : "Not specified"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Volunteers Needed: {opportunity.volunteersNeeded !== undefined ? opportunity.volunteersNeeded : "Not specified"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate(`/opportunity/${opportunity.opportunityID}`)}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Volunteer;
