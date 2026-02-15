import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';
import { getPublicConfig } from '../../services/config.service';

const validationSchema = Yup.object({
  firstName: Yup.string().max(50, 'Max 50 characters').required('First name is required'),
  lastName: Yup.string().max(50, 'Max 50 characters').required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Must contain a special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf([UserRole.ADMIN_USER, UserRole.VENDOR_USER])
    .required('Role is required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [allowAdminSignup, setAllowAdminSignup] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getPublicConfig();
        if (response.success && response.data) {
          setAllowAdminSignup(response.data.allowAdminSignup);
        }
      } catch {
        // Default to false if config fetch fails
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.VENDOR_USER as UserRole.ADMIN_USER | UserRole.VENDOR_USER,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await signup(values);
        navigate('/dashboard');
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
        setError(axiosErr.response?.data?.error?.message || 'Signup failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (configLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 480, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign up for ROAS PrintFast
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                margin="normal"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                margin="normal"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Box>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              autoComplete="email"
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              autoComplete="new-password"
            />
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              margin="normal"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              autoComplete="new-password"
            />
            <TextField
              fullWidth
              select
              id="role"
              name="role"
              label="Account Type"
              margin="normal"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value={UserRole.VENDOR_USER}>Vendor</MenuItem>
              {allowAdminSignup && <MenuItem value={UserRole.ADMIN_USER}>Admin</MenuItem>}
            </TextField>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={formik.isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {formik.isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </form>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
