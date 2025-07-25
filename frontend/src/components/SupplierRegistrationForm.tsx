import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  FormHelperText,
  Autocomplete,
} from '@mui/material';
import { Business, Person, LocationOn, Description, Schedule } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';

interface SupplierFormData {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  website: string;
  
  // Business Details
  businessType: string;
  registrationNumber: string;
  taxNumber: string;
  yearEstablished: string;
  
  // Location
  address: string;
  city: string;
  county: string;
  postalCode: string;
  
  // Categories and Specialties
  category: string;
  specialties: string[];
  
  // Description
  description: string;
  
  // Contact Person
  contactPerson: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  
  // Business Hours
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

const initialFormData: SupplierFormData = {
  name: '',
  email: '',
  phone: '',
  website: '',
  businessType: '',
  registrationNumber: '',
  taxNumber: '',
  yearEstablished: '',
  address: '',
  city: '',
  county: '',
  postalCode: '',
  category: '',
  specialties: [],
  description: '',
  contactPerson: {
    name: '',
    position: '',
    email: '',
    phone: '',
  },
  businessHours: {
    monday: { open: '08:00', close: '17:00', closed: false },
    tuesday: { open: '08:00', close: '17:00', closed: false },
    wednesday: { open: '08:00', close: '17:00', closed: false },
    thursday: { open: '08:00', close: '17:00', closed: false },
    friday: { open: '08:00', close: '17:00', closed: false },
    saturday: { open: '08:00', close: '13:00', closed: false },
    sunday: { open: '08:00', close: '13:00', closed: true },
  },
};

const categories = [
  'Military Footwear',
  'Safety Footwear',
  'Official Footwear',
  'Security Footwear',
  'Industrial Footwear',
  'Professional Footwear',
];

const specialtyOptions = [
  'Combat Boots',
  'Dress Shoes',
  'Safety Boots',
  'Steel Toe Boots',
  'Waterproof Footwear',
  'Slip-Resistant Shoes',
  'Tactical Boots',
  'Ceremonial Footwear',
  'Work Boots',
  'Protective Footwear',
  'Custom Manufacturing',
  'Bulk Orders',
  'International Shipping',
  'Quality Certification',
];

const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
  'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho',
  'Embu', 'Migori', 'Homa Bay', 'Naivasha', 'Voi', 'Wajir', 'Marsabit',
  'Isiolo', 'Maralal', 'Kapenguria', 'Bungoma', 'Webuye', 'Busia', 'Siaya',
  'Kisii', 'Kilifi', 'Lamu', 'Mandera', 'Moyale', 'Lodwar', 'Kitui',
  'Makueni', 'Machakos', 'Kajiado', 'Nanyuki', 'Nyahururu', 'Murang\'a',
  'Kerugoya', 'Kiambu', 'Limuru', 'Ruiru', 'Githunguri', 'Ol Kalou'
];

const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Company',
  'Public Limited Company',
  'Cooperative Society',
  'Non-Governmental Organization',
];

const steps = ['Basic Information', 'Business Details', 'Contact & Location', 'Review & Submit'];

const SupplierRegistrationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<SupplierFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const api = useApi();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof SupplierFormData] as any,
        [field]: value,
      },
    }));
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value,
        },
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) errors.name = 'Company name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        if (!formData.category) errors.category = 'Category is required';
        break;
        
      case 1: // Business Details
        if (!formData.businessType) errors.businessType = 'Business type is required';
        if (!formData.description.trim() || formData.description.length < 50) {
          errors.description = 'Description must be at least 50 characters';
        }
        if (formData.specialties.length === 0) errors.specialties = 'At least one specialty is required';
        break;
        
      case 2: // Contact & Location
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.county) errors.county = 'County is required';
        if (!formData.contactPerson.name.trim()) errors['contactPerson.name'] = 'Contact person name is required';
        if (!formData.contactPerson.email.trim()) errors['contactPerson.email'] = 'Contact person email is required';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/suppliers/register', formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      // Handle validation errors from the backend
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        err.response.data.errors.forEach((error: any) => {
          // The 'path' field from express-validator corresponds to the field name
          if (error.path) {
            backendErrors[error.path] = error.msg;
          }
        });
        setValidationErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Registration Successful! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Thank you for registering with Tabison Suppliers. Your application has been submitted 
              and is currently under review. We'll notify you via email once your account is approved.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.href = '/suppliers'}
              sx={{ mt: 2 }}
            >
              Browse Suppliers
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business /> Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!validationErrors.phone}
                helperText={validationErrors.phone}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website (Optional)"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!validationErrors.category} required>
                <InputLabel>Primary Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Primary Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.category && (
                  <FormHelperText>{validationErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description /> Business Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!validationErrors.businessType} required>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  label="Business Type"
                >
                  {businessTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.businessType && (
                  <FormHelperText>{validationErrors.businessType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year Established"
                type="number"
                value={formData.yearEstablished}
                onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Registration Number"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax Number (KRA PIN)"
                value={formData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={specialtyOptions}
                value={formData.specialties}
                onChange={(_, newValue) => handleInputChange('specialties', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Specialties"
                    placeholder="Select your specialties"
                    error={!!validationErrors.specialties}
                    helperText={validationErrors.specialties || 'Select at least one specialty'}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Company Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!validationErrors.description}
                helperText={validationErrors.description || `${formData.description.length}/1000 characters (minimum 50)`}
                required
              />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn /> Location & Contact
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={!!validationErrors.address}
                helperText={validationErrors.address}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={!!validationErrors.city}
                helperText={validationErrors.city}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={kenyanCounties}
                value={formData.county}
                onChange={(_, newValue) => handleInputChange('county', newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="County"
                    error={!!validationErrors.county}
                    helperText={validationErrors.county}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Contact Person
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person Name"
                value={formData.contactPerson.name}
                onChange={(e) => handleNestedInputChange('contactPerson', 'name', e.target.value)}
                error={!!validationErrors['contactPerson.name']}
                helperText={validationErrors['contactPerson.name']}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position/Title"
                value={formData.contactPerson.position}
                onChange={(e) => handleNestedInputChange('contactPerson', 'position', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactPerson.email}
                onChange={(e) => handleNestedInputChange('contactPerson', 'email', e.target.value)}
                error={!!validationErrors['contactPerson.email']}
                helperText={validationErrors['contactPerson.email']}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contactPerson.phone}
                onChange={(e) => handleNestedInputChange('contactPerson', 'phone', e.target.value)}
              />
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please review all the information below before submitting your registration.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Typography><strong>Company:</strong> {formData.name}</Typography>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
                <Typography><strong>Phone:</strong> {formData.phone}</Typography>
                <Typography><strong>Category:</strong> {formData.category}</Typography>
                {formData.website && <Typography><strong>Website:</strong> {formData.website}</Typography>}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Business Details</Typography>
                <Typography><strong>Type:</strong> {formData.businessType}</Typography>
                {formData.yearEstablished && <Typography><strong>Established:</strong> {formData.yearEstablished}</Typography>}
                <Typography><strong>Specialties:</strong> {formData.specialties.join(', ')}</Typography>
                <Typography><strong>Description:</strong> {formData.description}</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Location & Contact</Typography>
                <Typography><strong>Address:</strong> {formData.address}</Typography>
                <Typography><strong>City:</strong> {formData.city}, {formData.county}</Typography>
                <Typography><strong>Contact Person:</strong> {formData.contactPerson.name}</Typography>
                <Typography><strong>Contact Email:</strong> {formData.contactPerson.email}</Typography>
              </Paper>
            </Grid>
          </Grid>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center" color="primary">
            Supplier Registration
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Join our network of trusted suppliers and grow your business with us
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SupplierRegistrationForm;
