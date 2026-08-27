import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { User, Mail, Phone, Calendar, Globe, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '@components/ui/Card';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import useAuthStore from '@stores/useAuthStore';

const Profile = () => {
  const { user: clerkUser } = useUser();
  const { user, updateUser, loading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    language: 'english'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        language: user.language || 'english'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-tena-black mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="grid gap-6">
        {/* Account Info Card */}
        <Card>
          <Card.Header>
            <Card.Title>Account Information</Card.Title>
            <Card.Description>Your basic account details</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="flex items-center gap-4 mb-6">
              {clerkUser?.imageUrl ? (
                <img 
                  src={clerkUser.imageUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-tena-yellow flex items-center justify-center">
                  <User className="w-10 h-10 text-tena-black" />
                </div>
              )}
              <div>
                <p className="font-semibold text-lg text-tena-black">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-600">{user?.email}</p>
                <Badge variant="success" className="mt-2">
                  {user?.subscription?.plan || 'Free'} Plan
                </Badge>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Personal Information Form */}
        <Card>
          <Card.Header>
            <Card.Title>Personal Information</Card.Title>
            <Card.Description>Update your personal details</Card.Description>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={user?.email || ''}
                icon={Mail}
                disabled
                helperText="Email cannot be changed"
              />

              <Input
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                icon={Phone}
                placeholder="+251 91 123 4567"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  icon={Calendar}
                />

                <div>
                  <label className="block text-sm font-medium text-tena-black mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-tena-black mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Preferred Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="english">English</option>
                  <option value="amharic">Amharic (አማርኛ)</option>
                  <option value="afaan_oromoo">Afaan Oromoo</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  icon={Save}
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>

        {/* Account Stats */}
        <Card>
          <Card.Header>
            <Card.Title>Account Statistics</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-tena-black">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-lg font-semibold text-tena-black">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <Badge variant={user?.isActive ? 'success' : 'error'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-semibold text-tena-black capitalize">
                  {user?.role || 'Patient'}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
