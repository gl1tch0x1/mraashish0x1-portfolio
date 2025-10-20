import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { uploadAPI } from '../services/api';
import MatrixRain from '../components/effects/MatrixRain';
import GlitchText from '../components/effects/GlitchText';
import AnimatedCard from '../components/common/AnimatedCard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [cvData, setCvData] = useState({ title: '', googleDriveLink: '', description: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [aboutData, setAboutData] = useState({
    name: '',
    title: '',
    subtitle: '',
    profileImage: '',
    bio: [''],
    philosophy: ''
  });

  // Services state
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceData, setServiceData] = useState({
    title: '',
    description: '',
    icon: '',
    order: 0,
    active: true
  });

  // Skills state
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillData, setSkillData] = useState({
    name: '',
    icon: '',
    level: 'Intermediate',
    proficiency: 50,
    category: 'Other',
    featured: false,
    order: 0
  });

  // Projects state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    image: '',
    technologies: [],
    link: '',
    featured: false,
    order: 0,
    status: 'active'
  });

  // Timeline state
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [timelineData, setTimelineData] = useState({
    date: '',
    title: '',
    description: '',
    icon: 'fas fa-circle',
    position: 'left',
    order: 0
  });

  // Approach state
  const [showApproachForm, setShowApproachForm] = useState(false);
  const [editingApproach, setEditingApproach] = useState(null);
  const [approachData, setApproachData] = useState({
    title: '',
    description: '',
    icon: 'fas fa-shield-alt',
    order: 0,
    featured: true,
    active: true
  });

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login to access the dashboard');
      navigate('/sec/admin');
    }
  }, [navigate]);

  // Get auth token
  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/stats', getAuthHeader());
      return response.data.data;
    }
  });

  // Fetch CV info
  const { data: cvInfo, refetch: refetchCV } = useQuery({
    queryKey: ['cvInfo'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/cv');
        return response.data.data;
      } catch (error) {
        return null;
      }
    }
  });

  // CV Save Mutation
  const saveCVMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/cv/upload', data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('CV link saved successfully!');
      setCvData({ title: '', googleDriveLink: '', description: '' });
      refetchCV();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save CV link');
    }
  });

  // Handle CV input change
  const handleCVInputChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  // Handle CV save
  const handleCVSave = () => {
    if (!cvData.googleDriveLink) {
      toast.error('Please provide a Google Drive link');
      return;
    }
    if (!/^https?:\/\/.+/.test(cvData.googleDriveLink)) {
      toast.error('Please provide a valid URL');
      return;
    }
    saveCVMutation.mutate(cvData);
  };

  // Fetch site settings
  const { data: siteSettings, refetch: refetchSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const response = await axios.get('/api/settings');
      return response.data.data;
    }
  });

  // Toggle site status mutation
  const toggleSiteMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put('/api/settings/toggle', {}, getAuthHeader());
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      refetchSettings();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to toggle site status');
    }
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put('/api/auth/updatepassword', data, getAuthHeader());
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Update token if returned
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to change password');
    }
  });

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)) {
      toast.error('Password must contain at least one special character');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  // Fetch about data
  const { data: aboutInfo, refetch: refetchAbout } = useQuery({
    queryKey: ['aboutInfo'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/about');
        return response.data.data;
      } catch (error) {
        return null;
      }
    }
  });

  // Load about data into form when fetched
  useEffect(() => {
    if (aboutInfo) {
      setAboutData({
        name: aboutInfo.name || '',
        title: aboutInfo.title || '',
        subtitle: aboutInfo.subtitle || '',
        profileImage: aboutInfo.profileImage || '',
        bio: aboutInfo.bio && aboutInfo.bio.length > 0 ? aboutInfo.bio : [''],
        philosophy: aboutInfo.philosophy || ''
      });
    }
  }, [aboutInfo]);

  // Save about mutation
  const saveAboutMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put('/api/about', data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('About section updated successfully!');
      refetchAbout();
      queryClient.invalidateQueries(['aboutInfo']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update about section');
    }
  });

  // Handle about input change
  const handleAboutInputChange = (e) => {
    const { name, value } = e.target;
    setAboutData(prev => ({ ...prev, [name]: value }));
  };

  // Handle bio paragraph change
  const handleBioChange = (index, value) => {
    const newBio = [...aboutData.bio];
    newBio[index] = value;
    setAboutData(prev => ({ ...prev, bio: newBio }));
  };

  // Add bio paragraph
  const addBioParagraph = () => {
    setAboutData(prev => ({ ...prev, bio: [...prev.bio, ''] }));
  };

  // Remove bio paragraph
  const removeBioParagraph = (index) => {
    if (aboutData.bio.length > 1) {
      const newBio = aboutData.bio.filter((_, i) => i !== index);
      setAboutData(prev => ({ ...prev, bio: newBio }));
    }
  };

  // Handle about save
  const handleAboutSave = () => {
    if (!aboutData.name || !aboutData.title || !aboutData.profileImage) {
      toast.error('Please fill in all required fields (Name, Title, Profile Image)');
      return;
    }

    // Filter out empty bio paragraphs
    const filteredBio = aboutData.bio.filter(p => p.trim() !== '');

    saveAboutMutation.mutate({
      ...aboutData,
      bio: filteredBio
    });
  };

  // ==================== SERVICES MANAGEMENT ====================

  // Fetch all services
  const { data: servicesData, refetch: refetchServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await axios.get('/api/services');
      return response.data.data;
    }
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/services', data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service created successfully!');
      setShowServiceForm(false);
      setServiceData({ title: '', description: '', icon: '', order: 0, active: true });
      setImagePreview(null);
      refetchServices();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create service');
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/api/services/${id}`, data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service updated successfully!');
      setShowServiceForm(false);
      setEditingService(null);
      setServiceData({ title: '', description: '', icon: '', order: 0, active: true });
      setImagePreview(null);
      refetchServices();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update service');
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/services/${id}`, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service deleted successfully!');
      refetchServices();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete service');
    }
  });

  // Handle service form submit
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (!serviceData.title || !serviceData.description || !serviceData.icon) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingService) {
      updateServiceMutation.mutate({ id: editingService._id, data: serviceData });
    } else {
      createServiceMutation.mutate(serviceData);
    }
  };

  // Handle edit service
  const handleEditService = (service) => {
    setEditingService(service);
    setServiceData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      order: service.order || 0,
      active: service.active !== undefined ? service.active : true
    });
    setImagePreview(null);
    setShowServiceForm(true);
  };

  // Handle delete service
  const handleDeleteService = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteServiceMutation.mutate(id);
    }
  };

  // Cancel service form
  const handleCancelServiceForm = () => {
    setShowServiceForm(false);
    setEditingService(null);
    setServiceData({ title: '', description: '', icon: '', order: 0, active: true });
    setImagePreview(null);
  };

  // ==================== SKILLS MANAGEMENT ====================

  // Fetch all skills
  const { data: skillsData, refetch: refetchSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await axios.get('/api/skills');
      return response.data.data;
    }
  });

  // Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/skills', data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Skill created successfully!');
      setShowSkillForm(false);
      setSkillData({ name: '', icon: '', level: 'Intermediate', proficiency: 50, category: 'Other', featured: false, order: 0 });
      setImagePreview(null);
      refetchSkills();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create skill');
    }
  });

  // Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/api/skills/${id}`, data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Skill updated successfully!');
      setShowSkillForm(false);
      setEditingSkill(null);
      setSkillData({ name: '', icon: '', level: 'Intermediate', proficiency: 50, category: 'Other', featured: false, order: 0 });
      setImagePreview(null);
      refetchSkills();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update skill');
    }
  });

  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/skills/${id}`, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Skill deleted successfully!');
      refetchSkills();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete skill');
    }
  });

  // Handle skill form submit
  const handleSkillSubmit = (e) => {
    e.preventDefault();
    if (!skillData.name || !skillData.icon || !skillData.level) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingSkill) {
      updateSkillMutation.mutate({ id: editingSkill._id, data: skillData });
    } else {
      createSkillMutation.mutate(skillData);
    }
  };

  // Handle edit skill
  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setSkillData({
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      proficiency: skill.proficiency,
      category: skill.category || 'Other',
      featured: skill.featured || false,
      order: skill.order || 0
    });
    setImagePreview(null);
    setShowSkillForm(true);
  };

  // Handle delete skill
  const handleDeleteSkill = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteSkillMutation.mutate(id);
    }
  };

  // Cancel skill form
  const handleCancelSkillForm = () => {
    setShowSkillForm(false);
    setEditingSkill(null);
    setSkillData({ name: '', icon: '', level: 'Intermediate', proficiency: 50, category: 'Other', featured: false, order: 0 });
    setImagePreview(null);
  };

  // ==================== PROJECTS MANAGEMENT ====================

  // Fetch all projects
  const { data: projectsData, refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await axios.get('/api/projects');
      return response.data.data;
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/projects', data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Project created successfully!');
      setShowProjectForm(false);
      setProjectData({ title: '', description: '', fullDescription: '', image: '', technologies: [], link: '', featured: false, order: 0, status: 'active' });
      setImagePreview(null);
      refetchProjects();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create project');
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/api/projects/${id}`, data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Project updated successfully!');
      setShowProjectForm(false);
      setEditingProject(null);
      setProjectData({ title: '', description: '', fullDescription: '', image: '', technologies: [], link: '', featured: false, order: 0, status: 'active' });
      setImagePreview(null);
      refetchProjects();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update project');
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/projects/${id}`, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Project deleted successfully!');
      refetchProjects();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete project');
    }
  });

  // Handle project submit
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!projectData.title || !projectData.description || !projectData.fullDescription || !projectData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject._id, data: projectData });
    } else {
      createProjectMutation.mutate(projectData);
    }
  };

  // Handle edit project
  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectData({
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription,
      image: project.image,
      technologies: project.technologies || [],
      link: project.link || '',
      featured: project.featured,
      order: project.order,
      status: project.status
    });
    setImagePreview(null);
    setShowProjectForm(true);
  };

  // Handle delete project
  const handleDeleteProject = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProjectMutation.mutate(id);
    }
  };

  // Cancel project form
  const handleCancelProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    setProjectData({ title: '', description: '', fullDescription: '', image: '', technologies: [], link: '', featured: false, order: 0, status: 'active' });
    setImagePreview(null);
  };

  // ==================== TIMELINE MANAGEMENT ====================

  // Fetch all timeline items
  const { data: timelineItems, refetch: refetchTimeline } = useQuery({
    queryKey: ['timeline'],
    queryFn: async () => {
      const response = await axios.get('/api/timeline');
      return response.data.data;
    }
  });

  // Create timeline mutation
  const createTimelineMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/timeline', data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Timeline entry created successfully!');
      setShowTimelineForm(false);
      setTimelineData({ date: '', title: '', description: '', icon: 'fas fa-circle', position: 'left', order: 0 });
      refetchTimeline();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create timeline entry');
    }
  });

  // Update timeline mutation
  const updateTimelineMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/api/timeline/${id}`, data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Timeline entry updated successfully!');
      setShowTimelineForm(false);
      setEditingTimeline(null);
      setTimelineData({ date: '', title: '', description: '', icon: 'fas fa-circle', position: 'left', order: 0 });
      refetchTimeline();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update timeline entry');
    }
  });

  // Delete timeline mutation
  const deleteTimelineMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/timeline/${id}`, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Timeline entry deleted successfully!');
      refetchTimeline();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete timeline entry');
    }
  });

  // Handle timeline submit
  const handleTimelineSubmit = (e) => {
    e.preventDefault();
    if (!timelineData.date || !timelineData.title || !timelineData.description || !timelineData.icon) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingTimeline) {
      updateTimelineMutation.mutate({ id: editingTimeline._id, data: timelineData });
    } else {
      createTimelineMutation.mutate(timelineData);
    }
  };

  // Handle edit timeline
  const handleEditTimeline = (item) => {
    setEditingTimeline(item);
    setTimelineData({
      date: item.date,
      title: item.title,
      description: item.description,
      icon: item.icon,
      position: item.position,
      order: item.order
    });
    setShowTimelineForm(true);
  };

  // Handle delete timeline
  const handleDeleteTimeline = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTimelineMutation.mutate(id);
    }
  };

  // Cancel timeline form
  const handleCancelTimelineForm = () => {
    setShowTimelineForm(false);
    setEditingTimeline(null);
    setTimelineData({ date: '', title: '', description: '', icon: 'fas fa-circle', position: 'left', order: 0 });
  };

  // ==================== APPROACH MANAGEMENT ====================

  // Fetch all approach items
  const { data: approachItems, refetch: refetchApproach } = useQuery({
    queryKey: ['approach'],
    queryFn: async () => {
      const response = await axios.get('/api/approach');
      return response.data.data;
    }
  });

  // Create approach mutation
  const createApproachMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/approach', data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Approach item created successfully!');
      setShowApproachForm(false);
      setApproachData({ title: '', description: '', icon: 'fas fa-shield-alt', order: 0, featured: true, active: true });
      refetchApproach();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create approach item');
    }
  });

  // Update approach mutation
  const updateApproachMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/api/approach/${id}`, data, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Approach item updated successfully!');
      setShowApproachForm(false);
      setEditingApproach(null);
      setApproachData({ title: '', description: '', icon: 'fas fa-shield-alt', order: 0, featured: true, active: true });
      refetchApproach();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update approach item');
    }
  });

  // Delete approach mutation
  const deleteApproachMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/approach/${id}`, getAuthHeader());
      return response.data;
    },
    onSuccess: () => {
      toast.success('Approach item deleted successfully!');
      refetchApproach();
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete approach item');
    }
  });

  // Handle approach submit
  const handleApproachSubmit = (e) => {
    e.preventDefault();
    if (!approachData.title || !approachData.description || !approachData.icon) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingApproach) {
      updateApproachMutation.mutate({ id: editingApproach._id, data: approachData });
    } else {
      createApproachMutation.mutate(approachData);
    }
  };

  // Handle edit approach
  const handleEditApproach = (item) => {
    setEditingApproach(item);
    setApproachData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      order: item.order,
      featured: item.featured,
      active: item.active
    });
    setShowApproachForm(true);
  };

  // Handle delete approach
  const handleDeleteApproach = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteApproachMutation.mutate(id);
    }
  };

  // Cancel approach form
  const handleCancelApproachForm = () => {
    setShowApproachForm(false);
    setEditingApproach(null);
    setApproachData({ title: '', description: '', icon: 'fas fa-shield-alt', order: 0, featured: true, active: true });
  };

  // ==================== IMPORT/EXPORT FUNCTIONALITY ====================

  // Export Services as JSON
  const handleExportServices = () => {
    if (!servicesData || servicesData.length === 0) {
      toast.error('No services to export');
      return;
    }

    const exportData = {
      services: servicesData.map(({ _id, createdAt, updatedAt, __v, ...rest }) => rest)
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `services_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${servicesData.length} services`);
  };

  // Export Skills as JSON
  const handleExportSkills = () => {
    if (!skillsData || skillsData.length === 0) {
      toast.error('No skills to export');
      return;
    }

    const exportData = {
      skills: skillsData.map(({ _id, createdAt, updatedAt, __v, ...rest }) => rest)
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skills_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${skillsData.length} skills`);
  };

  // Import Services from JSON
  const handleImportServices = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        if (!importData.services || !Array.isArray(importData.services)) {
          toast.error('Invalid JSON format. Expected { "services": [...] }');
          return;
        }

        const count = importData.services.length;
        if (!window.confirm(`Import ${count} services? This will create new entries.`)) {
          return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const service of importData.services) {
          try {
            await axios.post('/api/services', service, getAuthHeader());
            successCount++;
          } catch (error) {
            errorCount++;
            console.error('Failed to import service:', service.title, error);
          }
        }

        refetchServices();
        queryClient.invalidateQueries(['dashboardStats']);
        toast.success(`Imported ${successCount} services successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // Import Skills from JSON
  const handleImportSkills = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        if (!importData.skills || !Array.isArray(importData.skills)) {
          toast.error('Invalid JSON format. Expected { "skills": [...] }');
          return;
        }

        const count = importData.skills.length;
        if (!window.confirm(`Import ${count} skills? This will create new entries.`)) {
          return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const skill of importData.skills) {
          try {
            await axios.post('/api/skills', skill, getAuthHeader());
            successCount++;
          } catch (error) {
            errorCount++;
            console.error('Failed to import skill:', skill.name, error);
          }
        }

        refetchSkills();
        queryClient.invalidateQueries(['dashboardStats']);
        toast.success(`Imported ${successCount} skills successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // ==================== IMAGE UPLOAD FUNCTIONALITY ====================

  // Handle image upload
  const handleImageUpload = async (event, targetField) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files are allowed (jpg, jpeg, png, gif, svg, webp)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = `http://localhost:5000${response.data.data.url}`;

      // Update the appropriate field based on targetField
      if (targetField === 'service') {
        setServiceData(prev => ({ ...prev, icon: imageUrl }));
      } else if (targetField === 'skill') {
        setSkillData(prev => ({ ...prev, icon: imageUrl }));
      } else if (targetField === 'project') {
        setProjectData(prev => ({ ...prev, image: imageUrl }));
      } else if (targetField === 'about') {
        setAboutData(prev => ({ ...prev, profileImage: imageUrl }));
      }

      setImagePreview(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      event.target.value = ''; // Reset input
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/sec/admin');
  };

  const tabs = [
    { id: 'content', name: 'Content', icon: 'fa-edit' },
    { id: 'overview', name: 'Overview', icon: 'fa-chart-line' },
    { id: 'cv', name: 'CV Management', icon: 'fa-file-pdf' },
    { id: 'about', name: 'About Section', icon: 'fa-user' },
    { id: 'settings', name: 'Settings', icon: 'fa-cogs' },
    { id: 'messages', name: 'Messages', icon: 'fa-envelope' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-primary-bg relative overflow-hidden">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <MatrixRain />
      </div>

      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 156, 0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 255, 156, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Header */}
      <header className="bg-secondary-bg/90 backdrop-blur-xl border-b border-accent-color/30 sticky top-0 z-50 shadow-lg shadow-accent-color/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-lg flex items-center justify-center border-2 border-accent-color/40 shadow-lg shadow-accent-color/20">
                  <i className="fas fa-shield-alt text-accent-color text-xl"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-color rounded-full animate-pulse"></div>
              </div>
              <div>
                <GlitchText text="ADMIN DASHBOARD" className="text-2xl font-bold text-accent-color font-mono" />
                <p className="text-xs text-text-secondary font-mono flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Secure Control Panel • System Active
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="group px-4 py-2 text-sm text-text-secondary hover:text-accent-color transition-all font-mono border border-transparent hover:border-accent-color/30 rounded-lg hover:bg-accent-color/5"
              >
                <i className="fas fa-home mr-2 group-hover:animate-pulse"></i>
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="group px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-mono text-sm border border-red-500/30 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20"
              >
                <i className="fas fa-sign-out-alt mr-2 group-hover:animate-pulse"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-secondary-bg/50 backdrop-blur-md rounded-lg border border-accent-color/20 p-2 shadow-xl">
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-accent-color/10 text-accent-color border-accent-color/50 shadow-lg shadow-accent-color/20'
                      : 'border-transparent text-text-secondary hover:text-accent-color hover:bg-accent-color/5'
                  } flex-1 whitespace-nowrap py-3 px-4 border-2 rounded-lg font-medium text-sm transition-all font-mono group`}
                >
                  <i className={`fas ${tab.icon} mr-2 ${activeTab === tab.id ? 'animate-pulse' : 'group-hover:animate-pulse'}`}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-accent-color font-mono flex items-center gap-3">
                <i className="fas fa-chart-bar"></i>
                Dashboard Overview
              </h2>
              <div className="flex items-center gap-2 text-xs text-text-secondary font-mono bg-secondary-bg/50 px-3 py-2 rounded-lg border border-accent-color/20">
                <i className="fas fa-clock text-accent-color"></i>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {statsLoading ? (
              <div className="text-center py-20">
                <div className="inline-block relative">
                  <i className="fas fa-spinner fa-spin text-5xl text-accent-color"></i>
                  <div className="absolute inset-0 animate-ping">
                    <i className="fas fa-spinner text-5xl text-accent-color opacity-20"></i>
                  </div>
                </div>
                <p className="mt-6 text-text-secondary font-mono text-lg">Loading statistics...</p>
                <div className="mt-4 flex justify-center gap-1">
                  <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards - Real Data from Database */}
                <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Total Projects</p>
                      <p className="text-4xl font-bold text-accent-color font-mono mt-2 tabular-nums">
                        {stats?.counts?.projects?.total || 0}
                      </p>
                      <p className="text-xs text-text-secondary font-mono mt-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                        <i className="fas fa-check-circle text-green-500 mr-1"></i>
                        {stats?.counts?.projects?.active || 0} active
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-xl flex items-center justify-center border border-accent-color/30 shadow-lg">
                      <i className="fas fa-project-diagram text-2xl text-accent-color"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Total Skills</p>
                      <p className="text-4xl font-bold text-accent-color font-mono mt-2 tabular-nums">
                        {stats?.counts?.skills?.total || 0}
                      </p>
                      <p className="text-xs text-text-secondary font-mono mt-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                        <i className="fas fa-star text-yellow-500 mr-1"></i>
                        {stats?.counts?.skills?.featured || 0} featured
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-xl flex items-center justify-center border border-accent-color/30 shadow-lg">
                      <i className="fas fa-code text-2xl text-accent-color"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Timeline Items</p>
                      <p className="text-4xl font-bold text-accent-color font-mono mt-2 tabular-nums">
                        {stats?.counts?.timeline || 0}
                      </p>
                      <p className="text-xs text-text-secondary font-mono mt-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                        <i className="fas fa-history text-blue-500 mr-1"></i>
                        Career milestones
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-xl flex items-center justify-center border border-accent-color/30 shadow-lg">
                      <i className="fas fa-clock text-2xl text-accent-color"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Contact Messages</p>
                      <p className="text-4xl font-bold text-accent-color font-mono mt-2 tabular-nums">
                        {stats?.counts?.contacts?.total || 0}
                      </p>
                      <p className="text-xs text-text-secondary font-mono mt-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                        <i className="fas fa-envelope-open text-green-500 mr-1"></i>
                        {stats?.counts?.contacts?.unread || 0} unread
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-xl flex items-center justify-center border border-accent-color/30 shadow-lg">
                      <i className="fas fa-envelope text-2xl text-accent-color"></i>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Section */}
            {!statsLoading && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-accent-color font-mono mb-4 flex items-center gap-2">
                  <i className="fas fa-bolt"></i>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('cv')}
                    className="group bg-secondary-bg/50 backdrop-blur-md rounded-lg border border-accent-color/20 p-4 hover:border-accent-color/50 transition-all hover:shadow-lg hover:shadow-accent-color/10 text-left"
                  >
                    <i className="fas fa-file-pdf text-2xl text-accent-color mb-2 group-hover:animate-bounce"></i>
                    <h4 className="text-text-primary font-mono font-semibold mb-1">Manage CV</h4>
                    <p className="text-xs text-text-secondary font-mono">Upload or update your CV</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="group bg-secondary-bg/50 backdrop-blur-md rounded-lg border border-accent-color/20 p-4 hover:border-accent-color/50 transition-all hover:shadow-lg hover:shadow-accent-color/10 text-left"
                  >
                    <i className="fas fa-edit text-2xl text-accent-color mb-2 group-hover:animate-bounce"></i>
                    <h4 className="text-text-primary font-mono font-semibold mb-1">Edit Content</h4>
                    <p className="text-xs text-text-secondary font-mono">Manage portfolio content</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="group bg-secondary-bg/50 backdrop-blur-md rounded-lg border border-accent-color/20 p-4 hover:border-accent-color/50 transition-all hover:shadow-lg hover:shadow-accent-color/10 text-left"
                  >
                    <i className="fas fa-envelope text-2xl text-accent-color mb-2 group-hover:animate-bounce"></i>
                    <h4 className="text-text-primary font-mono font-semibold mb-1">View Messages</h4>
                    <p className="text-xs text-text-secondary font-mono">Check contact inquiries</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cv' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-accent-color font-mono flex items-center gap-3">
                <i className="fas fa-link"></i>
                CV Management
              </h2>
              <div className="flex items-center gap-2 text-xs text-text-secondary font-mono bg-secondary-bg/50 px-3 py-2 rounded-lg border border-accent-color/20">
                <i className="fas fa-info-circle text-accent-color"></i>
                <span>Google Drive Link</span>
              </div>
            </div>

            {/* Current CV Info */}
            {cvInfo && (
              <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-accent-color font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-check-circle"></i>
                    Current CV
                  </h3>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-mono border border-green-500/30">
                    <i className="fas fa-circle text-xs mr-1"></i>
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary-bg/30 rounded-lg p-4 border border-accent-color/10">
                    <p className="text-xs text-text-secondary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Title</p>
                    <p className="text-sm text-text-primary font-mono font-semibold truncate">{cvInfo.title}</p>
                  </div>
                  <div className="bg-primary-bg/30 rounded-lg p-4 border border-accent-color/10">
                    <p className="text-xs text-text-secondary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Google Drive Link</p>
                    <a href={cvInfo.googleDriveLink} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-color font-mono font-semibold truncate hover:underline flex items-center gap-2">
                      <i className="fas fa-external-link-alt text-xs"></i>
                      View Link
                    </a>
                  </div>
                  <div className="bg-primary-bg/30 rounded-lg p-4 border border-accent-color/10">
                    <p className="text-xs text-text-secondary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Upload Date</p>
                    <p className="text-sm text-text-primary font-mono font-semibold">{new Date(cvInfo.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-primary-bg/30 rounded-lg p-4 border border-accent-color/10">
                    <p className="text-xs text-text-secondary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Total Views</p>
                    <p className="text-sm text-accent-color font-mono font-semibold flex items-center gap-2">
                      <i className="fas fa-eye"></i>
                      {cvInfo.viewCount}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add/Update CV Link */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-accent-color font-mono mb-4 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                <i className="fas fa-link"></i>
                {cvInfo ? 'Update CV Link' : 'Add CV Link'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-heading text-accent-color"></i>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={cvData.title}
                    onChange={handleCVInputChange}
                    placeholder="e.g., My CV, Resume 2024"
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fab fa-google-drive text-accent-color"></i>
                    Google Drive Link *
                  </label>
                  <input
                    type="url"
                    name="googleDriveLink"
                    value={cvData.googleDriveLink}
                    onChange={handleCVInputChange}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                  <p className="mt-2 text-xs text-text-secondary font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-info-circle text-accent-color"></i>
                    Make sure the link is publicly accessible or set to "Anyone with the link can view"
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-align-left text-accent-color"></i>
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={cvData.description}
                    onChange={handleCVInputChange}
                    placeholder="Brief description about this CV version"
                    rows="3"
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                </div>
                <button
                  onClick={handleCVSave}
                  disabled={saveCVMutation.isPending || !cvData.googleDriveLink}
                  className="w-full px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                >
                  {saveCVMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save CV Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-accent-color font-mono flex items-center gap-3">
                <i className="fas fa-edit"></i>
                Content Management
              </h2>
              <div className="flex items-center gap-2 text-xs text-text-secondary font-mono bg-secondary-bg/50 px-3 py-2 rounded-lg border border-accent-color/20">
                <i className="fas fa-database text-accent-color"></i>
                <span>Manage portfolio data</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Projects Management */}
              <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-color/10 rounded-lg flex items-center justify-center border border-accent-color/30">
                    <i className="fas fa-project-diagram text-2xl text-accent-color"></i>
                  </div>
                  <span className="px-2 py-1 bg-accent-color/10 text-accent-color rounded text-xs font-mono">
                    {stats?.counts?.projects?.total || 0}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary font-mono mb-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Projects</h3>
                <p className="text-sm text-text-secondary font-mono mb-4" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Manage portfolio projects and case studies</p>
                <button className="w-full px-4 py-2 bg-accent-color/10 text-accent-color rounded-lg hover:bg-accent-color/20 transition-all font-mono text-sm border border-accent-color/30 hover:border-accent-color/50">
                  <i className="fas fa-cog mr-2"></i>
                  Manage Projects
                </button>
              </div>

              {/* Skills Management */}
              <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-color/10 rounded-lg flex items-center justify-center border border-accent-color/30">
                    <i className="fas fa-code text-2xl text-accent-color"></i>
                  </div>
                  <span className="px-2 py-1 bg-accent-color/10 text-accent-color rounded text-xs font-mono">
                    {stats?.counts?.skills?.total || 0}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary font-mono mb-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Skills</h3>
                <p className="text-sm text-text-secondary font-mono mb-4" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Update technical skills and expertise</p>
                <button className="w-full px-4 py-2 bg-accent-color/10 text-accent-color rounded-lg hover:bg-accent-color/20 transition-all font-mono text-sm border border-accent-color/30 hover:border-accent-color/50">
                  <i className="fas fa-cog mr-2"></i>
                  Manage Skills
                </button>
              </div>

              {/* Services Management */}
              <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-color/10 rounded-lg flex items-center justify-center border border-accent-color/30">
                    <i className="fas fa-briefcase text-2xl text-accent-color"></i>
                  </div>
                  <span className="px-2 py-1 bg-accent-color/10 text-accent-color rounded text-xs font-mono">
                    {stats?.counts?.services || 0}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary font-mono mb-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Services</h3>
                <p className="text-sm text-text-secondary font-mono mb-4" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Edit service offerings and descriptions</p>
                <button className="w-full px-4 py-2 bg-accent-color/10 text-accent-color rounded-lg hover:bg-accent-color/20 transition-all font-mono text-sm border border-accent-color/30 hover:border-accent-color/50">
                  <i className="fas fa-cog mr-2"></i>
                  Manage Services
                </button>
              </div>

              {/* Timeline Management */}
              <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-color/10 rounded-lg flex items-center justify-center border border-accent-color/30">
                    <i className="fas fa-history text-2xl text-accent-color"></i>
                  </div>
                  <span className="px-2 py-1 bg-accent-color/10 text-accent-color rounded text-xs font-mono">
                    {stats?.counts?.timeline || 0}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary font-mono mb-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Timeline</h3>
                <p className="text-sm text-text-secondary font-mono mb-4" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Update career timeline and milestones</p>
                <button className="w-full px-4 py-2 bg-accent-color/10 text-accent-color rounded-lg hover:bg-accent-color/20 transition-all font-mono text-sm border border-accent-color/30 hover:border-accent-color/50">
                  <i className="fas fa-cog mr-2"></i>
                  Manage Timeline
                </button>
              </div>

              {/* About Management */}
              <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-color/10 rounded-lg flex items-center justify-center border border-accent-color/30">
                    <i className="fas fa-user text-2xl text-accent-color"></i>
                  </div>
                  <span className="px-2 py-1 bg-accent-color/10 text-accent-color rounded text-xs font-mono">
                    <i className="fas fa-info"></i>
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary font-mono mb-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>About</h3>
                <p className="text-sm text-text-secondary font-mono mb-4" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Edit about section and bio information</p>
                <button
                  onClick={() => setActiveTab('about')}
                  className="w-full px-4 py-2 bg-accent-color/10 text-accent-color rounded-lg hover:bg-accent-color/20 transition-all font-mono text-sm border border-accent-color/30 hover:border-accent-color/50">
                  <i className="fas fa-cog mr-2"></i>
                  Manage About
                </button>
              </div>

              {/* Settings */}
              <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-color/10 rounded-lg flex items-center justify-center border border-accent-color/30">
                    <i className="fas fa-cogs text-2xl text-accent-color"></i>
                  </div>
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-mono">
                    <i className="fas fa-wrench"></i>
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary font-mono mb-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Settings</h3>
                <p className="text-sm text-text-secondary font-mono mb-4" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Password & site configuration</p>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full px-4 py-2 bg-accent-color/10 text-accent-color rounded-lg hover:bg-accent-color/20 transition-all font-mono text-sm border border-accent-color/30 hover:border-accent-color/50">
                  <i className="fas fa-cog mr-2"></i>
                  Open Settings
                </button>
              </div>
            </div>

            {/* Services Management Section */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-accent-color font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-briefcase"></i>
                  Services Management
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportServices}
                    className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm font-semibold"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                    title="Export Services as JSON"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Export
                  </button>
                  <label className="px-3 py-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 border border-purple-500/30 font-mono text-sm font-semibold cursor-pointer" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }} title="Import Services from JSON">
                    <i className="fas fa-upload mr-2"></i>
                    Import
                    <input type="file" accept=".json" onChange={handleImportServices} className="hidden" />
                  </label>
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setServiceData({ title: '', description: '', icon: '', order: 0, active: true });
                      setImagePreview(null);
                      setShowServiceForm(true);
                    }}
                    className="px-4 py-2 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold shadow-lg"
                    style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add New Service
                  </button>
                </div>
              </div>

              {/* Services List */}
              {servicesData && servicesData.length > 0 ? (
                <div className="space-y-3">
                  {servicesData.map((service) => (
                    <div key={service._id} className="bg-primary-bg/30 border border-accent-color/20 rounded-lg p-4 hover:border-accent-color/40 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <i className={`${service.icon} text-accent-color text-xl`}></i>
                            <h4 className="text-text-primary font-mono font-semibold" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{service.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-mono ${service.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {service.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary font-mono line-clamp-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{service.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id, service.title)}
                            className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-briefcase text-4xl mb-3 opacity-30"></i>
                  <p>No services found. Click "Add New Service" to create one.</p>
                </div>
              )}

              {/* Service Form Modal */}
              {showServiceForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-secondary-bg to-primary-bg rounded-xl border border-accent-color/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-accent-color font-mono mb-6 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-briefcase"></i>
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-heading text-accent-color mr-2"></i>
                          Title *
                        </label>
                        <input
                          type="text"
                          value={serviceData.title}
                          onChange={(e) => setServiceData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Service title"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-align-left text-accent-color mr-2"></i>
                          Description *
                        </label>
                        <textarea
                          value={serviceData.description}
                          onChange={(e) => setServiceData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Service description"
                          rows="4"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-icons text-accent-color mr-2"></i>
                          Icon (Font Awesome class or Image URL) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={serviceData.icon}
                            onChange={(e) => setServiceData(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="e.g., fas fa-shield-alt or image URL"
                            className="flex-1 bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          />
                          <label className="px-4 py-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm font-semibold cursor-pointer flex items-center gap-2 whitespace-nowrap" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }} title="Upload Image">
                            {uploadingImage ? (
                              <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                            ) : (
                              <><i className="fas fa-upload"></i> Upload</>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'service')} className="hidden" disabled={uploadingImage} />
                          </label>
                        </div>
                        {serviceData.icon && serviceData.icon.startsWith('http') && (
                          <img src={serviceData.icon} alt="Icon preview" className="mt-2 w-16 h-16 object-cover rounded border border-accent-color/30" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-sort text-accent-color mr-2"></i>
                            Order
                          </label>
                          <input
                            type="number"
                            value={serviceData.order}
                            onChange={(e) => setServiceData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-toggle-on text-accent-color mr-2"></i>
                            Status
                          </label>
                          <select
                            value={serviceData.active ? 'true' : 'false'}
                            onChange={(e) => setServiceData(prev => ({ ...prev, active: e.target.value === 'true' }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                          className="flex-1 px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          {(createServiceMutation.isPending || updateServiceMutation.isPending) ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save mr-2"></i>
                              {editingService ? 'Update Service' : 'Create Service'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelServiceForm}
                          className="px-6 py-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm font-semibold"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Skills Management Section */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-accent-color font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-code"></i>
                  Skills Management
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportSkills}
                    className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm font-semibold"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                    title="Export Skills as JSON"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Export
                  </button>
                  <label className="px-3 py-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 border border-purple-500/30 font-mono text-sm font-semibold cursor-pointer" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }} title="Import Skills from JSON">
                    <i className="fas fa-upload mr-2"></i>
                    Import
                    <input type="file" accept=".json" onChange={handleImportSkills} className="hidden" />
                  </label>
                  <button
                    onClick={() => {
                      setEditingSkill(null);
                      setSkillData({ name: '', icon: '', level: '', proficiency: 50, category: 'Other', featured: false, order: 0 });
                      setImagePreview(null);
                      setShowSkillForm(true);
                    }}
                    className="px-4 py-2 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold shadow-lg"
                    style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add New Skill
                  </button>
                </div>
              </div>

              {/* Skills List */}
              {skillsData && skillsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skillsData.map((skill) => (
                    <div key={skill._id} className="bg-primary-bg/30 border border-accent-color/20 rounded-lg p-4 hover:border-accent-color/40 transition-all">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <i className={`${skill.icon} text-accent-color text-xl`}></i>
                          <div>
                            <h4 className="text-text-primary font-mono font-semibold" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{skill.name}</h4>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">{skill.category}</span>
                              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded text-xs font-mono">{skill.level}</span>
                              {skill.featured && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-xs font-mono">Featured</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSkill(skill)}
                            className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill._id, skill.name)}
                            className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-text-secondary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <span>Proficiency</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-primary-bg/50 rounded-full h-2">
                          <div
                            className="bg-accent-color rounded-full h-2 transition-all"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-code text-4xl mb-3 opacity-30"></i>
                  <p>No skills found. Click "Add New Skill" to create one.</p>
                </div>
              )}

              {/* Skill Form Modal */}
              {showSkillForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-secondary-bg to-primary-bg rounded-xl border border-accent-color/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-accent-color font-mono mb-6 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-code"></i>
                      {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                    </h3>
                    <form onSubmit={handleSkillSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-tag text-accent-color mr-2"></i>
                          Name *
                        </label>
                        <input
                          type="text"
                          value={skillData.name}
                          onChange={(e) => setSkillData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Skill name"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-icons text-accent-color mr-2"></i>
                          Icon (Font Awesome class or Image URL) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillData.icon}
                            onChange={(e) => setSkillData(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="e.g., fas fa-code or image URL"
                            className="flex-1 bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          />
                          <label className="px-4 py-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm font-semibold cursor-pointer flex items-center gap-2 whitespace-nowrap" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }} title="Upload Image">
                            {uploadingImage ? (
                              <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                            ) : (
                              <><i className="fas fa-upload"></i> Upload</>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'skill')} className="hidden" disabled={uploadingImage} />
                          </label>
                        </div>
                        {skillData.icon && skillData.icon.startsWith('http') && (
                          <img src={skillData.icon} alt="Icon preview" className="mt-2 w-16 h-16 object-cover rounded border border-accent-color/30" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-layer-group text-accent-color mr-2"></i>
                            Category *
                          </label>
                          <select
                            value={skillData.category}
                            onChange={(e) => setSkillData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Design">Design</option>
                            <option value="Tools">Tools</option>
                            <option value="Scripting">Scripting</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-chart-line text-accent-color mr-2"></i>
                            Level *
                          </label>
                          <select
                            value={skillData.level}
                            onChange={(e) => setSkillData(prev => ({ ...prev, level: e.target.value }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          >
                            <option value="Basic">Basic</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Proficient">Proficient</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-percentage text-accent-color mr-2"></i>
                          Proficiency: {skillData.proficiency}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skillData.proficiency}
                          onChange={(e) => setSkillData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-primary-bg/30 rounded-lg appearance-none cursor-pointer accent-accent-color"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-sort text-accent-color mr-2"></i>
                            Order
                          </label>
                          <input
                            type="number"
                            value={skillData.order}
                            onChange={(e) => setSkillData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-star text-accent-color mr-2"></i>
                            Featured
                          </label>
                          <select
                            value={skillData.featured ? 'true' : 'false'}
                            onChange={(e) => setSkillData(prev => ({ ...prev, featured: e.target.value === 'true' }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={createSkillMutation.isPending || updateSkillMutation.isPending}
                          className="flex-1 px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          {(createSkillMutation.isPending || updateSkillMutation.isPending) ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save mr-2"></i>
                              {editingSkill ? 'Update Skill' : 'Create Skill'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelSkillForm}
                          className="px-6 py-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm font-semibold"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Projects Management Section */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-accent-color font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-project-diagram"></i>
                  Projects Management
                </h3>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectData({ title: '', description: '', fullDescription: '', image: '', technologies: [], link: '', featured: false, order: 0, status: 'active' });
                    setImagePreview(null);
                    setShowProjectForm(true);
                  }}
                  className="px-4 py-2 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold shadow-lg"
                  style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add New Project
                </button>
              </div>

              {/* Projects List */}
              {projectsData && projectsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectsData.map((project) => (
                    <div key={project._id} className="bg-primary-bg/30 border border-accent-color/20 rounded-lg p-4 hover:border-accent-color/40 transition-all">
                      <div className="flex gap-4 mb-3">
                        {project.image && (
                          <img src={project.image} alt={project.title} className="w-20 h-20 object-cover rounded-lg border border-accent-color/30" />
                        )}
                        <div className="flex-1">
                          <h4 className="text-text-primary font-mono font-semibold mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{project.title}</h4>
                          <p className="text-text-secondary text-sm mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            {project.featured && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-xs font-mono">Featured</span>}
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">{project.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {project.technologies?.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-accent-color/10 text-accent-color rounded text-xs font-mono">{tech}</span>
                        ))}
                        {project.technologies?.length > 3 && <span className="px-2 py-0.5 bg-accent-color/10 text-accent-color rounded text-xs font-mono">+{project.technologies.length - 3}</span>}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id, project.title)}
                          className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-project-diagram text-4xl mb-3 opacity-30"></i>
                  <p>No projects found. Click "Add New Project" to create one.</p>
                </div>
              )}

              {/* Project Form Modal */}
              {showProjectForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-secondary-bg to-primary-bg rounded-xl border border-accent-color/30 p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-accent-color font-mono mb-6 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-project-diagram"></i>
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </h3>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-heading text-accent-color mr-2"></i>
                            Title *
                          </label>
                          <input
                            type="text"
                            value={projectData.title}
                            onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Project title"
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-image text-accent-color mr-2"></i>
                            Image URL *
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={projectData.image}
                              onChange={(e) => setProjectData(prev => ({ ...prev, image: e.target.value }))}
                              placeholder="Image URL"
                              className="flex-1 bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                              style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                              required
                            />
                            <label className="px-4 py-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm font-semibold cursor-pointer flex items-center gap-2 whitespace-nowrap" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }} title="Upload Image">
                              {uploadingImage ? (
                                <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                              ) : (
                                <><i className="fas fa-upload"></i> Upload</>
                              )}
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} className="hidden" disabled={uploadingImage} />
                            </label>
                          </div>
                          {projectData.image && (
                            <img src={projectData.image} alt="Project preview" className="mt-2 w-full h-32 object-cover rounded border border-accent-color/30" />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-align-left text-accent-color mr-2"></i>
                          Short Description *
                        </label>
                        <textarea
                          value={projectData.description}
                          onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description (max 500 chars)"
                          rows="2"
                          maxLength="500"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-file-alt text-accent-color mr-2"></i>
                          Full Description *
                        </label>
                        <textarea
                          value={projectData.fullDescription}
                          onChange={(e) => setProjectData(prev => ({ ...prev, fullDescription: e.target.value }))}
                          placeholder="Detailed description"
                          rows="4"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-code text-accent-color mr-2"></i>
                          Technologies (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={projectData.technologies.join(', ')}
                          onChange={(e) => setProjectData(prev => ({ ...prev, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
                          placeholder="React, Node.js, MongoDB"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-link text-accent-color mr-2"></i>
                            Live Demo URL
                          </label>
                          <input
                            type="text"
                            value={projectData.link}
                            onChange={(e) => setProjectData(prev => ({ ...prev, link: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-sort text-accent-color mr-2"></i>
                            Order
                          </label>
                          <input
                            type="number"
                            value={projectData.order}
                            onChange={(e) => setProjectData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-toggle-on text-accent-color mr-2"></i>
                            Status
                          </label>
                          <select
                            value={projectData.status}
                            onChange={(e) => setProjectData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          >
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={projectData.featured}
                            onChange={(e) => setProjectData(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 accent-accent-color"
                          />
                          <span className="text-sm font-medium text-text-primary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-star text-accent-color mr-2"></i>
                            Featured Project
                          </span>
                        </label>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                          className="flex-1 px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          {(createProjectMutation.isPending || updateProjectMutation.isPending) ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save mr-2"></i>
                              {editingProject ? 'Update Project' : 'Create Project'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelProjectForm}
                          className="px-6 py-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm font-semibold"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Management Section */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-accent-color font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-clock"></i>
                  Timeline Management
                </h3>
                <button
                  onClick={() => setShowTimelineForm(true)}
                  className="px-4 py-2 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold shadow-lg"
                  style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Timeline Entry
                </button>
              </div>

              {/* Timeline List */}
              {timelineItems && timelineItems.length > 0 ? (
                <div className="space-y-3">
                  {timelineItems.map((item) => (
                    <div key={item._id} className="bg-primary-bg/30 border border-accent-color/20 rounded-lg p-4 hover:border-accent-color/40 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <i className={`${item.icon} text-accent-color text-xl mt-1`}></i>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-accent-color font-mono text-sm" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{item.date}</span>
                              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded text-xs font-mono">{item.position}</span>
                            </div>
                            <h4 className="text-text-primary font-mono font-semibold mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{item.title}</h4>
                            <p className="text-text-secondary text-sm line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTimeline(item)}
                            className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteTimeline(item._id, item.title)}
                            className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-clock text-4xl mb-3 opacity-30"></i>
                  <p>No timeline entries found. Click "Add Timeline Entry" to create one.</p>
                </div>
              )}

              {/* Timeline Form Modal */}
              {showTimelineForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-secondary-bg to-primary-bg rounded-xl border border-accent-color/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-accent-color font-mono mb-6 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-clock"></i>
                      {editingTimeline ? 'Edit Timeline Entry' : 'Add Timeline Entry'}
                    </h3>
                    <form onSubmit={handleTimelineSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-calendar text-accent-color mr-2"></i>
                            Date/Year *
                          </label>
                          <input
                            type="text"
                            value={timelineData.date}
                            onChange={(e) => setTimelineData(prev => ({ ...prev, date: e.target.value }))}
                            placeholder="e.g., 2023 - Present"
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-icons text-accent-color mr-2"></i>
                            Icon (Font Awesome) *
                          </label>
                          <input
                            type="text"
                            value={timelineData.icon}
                            onChange={(e) => setTimelineData(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="e.g., fas fa-briefcase"
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-heading text-accent-color mr-2"></i>
                          Title *
                        </label>
                        <input
                          type="text"
                          value={timelineData.title}
                          onChange={(e) => setTimelineData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Event title"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-align-left text-accent-color mr-2"></i>
                          Description *
                        </label>
                        <textarea
                          value={timelineData.description}
                          onChange={(e) => setTimelineData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Event description"
                          rows="4"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-arrows-alt-h text-accent-color mr-2"></i>
                            Position
                          </label>
                          <select
                            value={timelineData.position}
                            onChange={(e) => setTimelineData(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          >
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-sort text-accent-color mr-2"></i>
                            Order
                          </label>
                          <input
                            type="number"
                            value={timelineData.order}
                            onChange={(e) => setTimelineData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={createTimelineMutation.isPending || updateTimelineMutation.isPending}
                          className="flex-1 px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          {(createTimelineMutation.isPending || updateTimelineMutation.isPending) ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save mr-2"></i>
                              {editingTimeline ? 'Update Entry' : 'Create Entry'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelTimelineForm}
                          className="px-6 py-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm font-semibold"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Approach Management Section */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-accent-color font-mono flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-shield-alt"></i>
                  My Approach Management
                </h3>
                <button
                  onClick={() => {
                    setEditingApproach(null);
                    setApproachData({ title: '', description: '', icon: 'fas fa-shield-alt', order: 0, featured: true, active: true });
                    setShowApproachForm(true);
                  }}
                  className="px-4 py-2 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold shadow-lg"
                  style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Approach Item
                </button>
              </div>

              {/* Approach List */}
              {approachItems && approachItems.length > 0 ? (
                <div className="space-y-3">
                  {approachItems.map((item) => (
                    <div key={item._id} className="bg-primary-bg/30 border border-accent-color/20 rounded-lg p-4 hover:border-accent-color/40 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <i className={`${item.icon} text-accent-color text-xl mt-1`}></i>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-text-primary font-mono font-semibold" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{item.title}</h4>
                              {item.featured && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-xs font-mono">Featured</span>}
                              {item.active && <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-xs font-mono">Active</span>}
                            </div>
                            <p className="text-text-secondary text-sm line-clamp-2">{item.description}</p>
                            <span className="text-xs text-accent-color/60 font-mono mt-1 inline-block">Order: {item.order}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditApproach(item)}
                            className="px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteApproach(item._id, item.title)}
                            className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  <i className="fas fa-shield-alt text-4xl mb-3 opacity-30"></i>
                  <p>No approach items found. Click "Add Approach Item" to create one.</p>
                </div>
              )}

              {/* Approach Form Modal */}
              {showApproachForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-secondary-bg to-primary-bg rounded-xl border border-accent-color/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-accent-color font-mono mb-6 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-shield-alt"></i>
                      {editingApproach ? 'Edit Approach Item' : 'Add Approach Item'}
                    </h3>
                    <form onSubmit={handleApproachSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-heading text-accent-color mr-2"></i>
                          Title *
                        </label>
                        <input
                          type="text"
                          value={approachData.title}
                          onChange={(e) => setApproachData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Proactive Defense"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                          <i className="fas fa-align-left text-accent-color mr-2"></i>
                          Description *
                        </label>
                        <textarea
                          value={approachData.description}
                          onChange={(e) => setApproachData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Detailed description of your approach..."
                          rows="5"
                          className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-icons text-accent-color mr-2"></i>
                            Icon (Font Awesome) *
                          </label>
                          <input
                            type="text"
                            value={approachData.icon}
                            onChange={(e) => setApproachData(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="e.g., fas fa-shield-alt"
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-sort text-accent-color mr-2"></i>
                            Order
                          </label>
                          <input
                            type="number"
                            value={approachData.order}
                            onChange={(e) => setApproachData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-star text-accent-color mr-2"></i>
                            Featured
                          </label>
                          <select
                            value={approachData.featured ? 'true' : 'false'}
                            onChange={(e) => setApproachData(prev => ({ ...prev, featured: e.target.value === 'true' }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                            <i className="fas fa-toggle-on text-accent-color mr-2"></i>
                            Active
                          </label>
                          <select
                            value={approachData.active ? 'true' : 'false'}
                            onChange={(e) => setApproachData(prev => ({ ...prev, active: e.target.value === 'true' }))}
                            className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                            style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={createApproachMutation.isPending || updateApproachMutation.isPending}
                          className="flex-1 px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          {(createApproachMutation.isPending || updateApproachMutation.isPending) ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save mr-2"></i>
                              {editingApproach ? 'Update Item' : 'Create Item'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelApproachForm}
                          className="px-6 py-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30 font-mono text-sm font-semibold"
                          style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-accent-color font-mono flex items-center gap-3" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                <i className="fas fa-user"></i>
                About Section Management
              </h2>
            </div>

            {/* About Form */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-user text-accent-color mr-2"></i>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={aboutData.name}
                      onChange={handleAboutInputChange}
                      placeholder="Your Name"
                      className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                      style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-briefcase text-accent-color mr-2"></i>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={aboutData.title}
                      onChange={handleAboutInputChange}
                      placeholder="Your Title/Role"
                      className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                      style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-heading text-accent-color mr-2"></i>
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={aboutData.subtitle}
                    onChange={handleAboutInputChange}
                    placeholder="Subtitle or tagline"
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-image text-accent-color mr-2"></i>
                    Profile Image URL * (Google Drive Link or Direct URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="profileImage"
                      value={aboutData.profileImage}
                      onChange={handleAboutInputChange}
                      placeholder="https://drive.google.com/... or direct image URL"
                      className="flex-1 bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                      style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                    />
                    <label className="px-4 py-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 font-mono text-sm cursor-pointer flex items-center gap-2">
                      <i className="fas fa-upload"></i>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'about')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {aboutData.profileImage && (
                    <div className="mt-2">
                      <img
                        src={aboutData.profileImage}
                        alt="Profile Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-accent-color/30"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-text-secondary mt-1 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-info-circle text-accent-color mr-1"></i>
                    For Google Drive: Share image → Get link → Paste here. Or upload directly.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-text-primary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      <i className="fas fa-align-left text-accent-color mr-2"></i>
                      Bio Paragraphs
                    </label>
                    <button
                      onClick={addBioParagraph}
                      className="px-3 py-1 bg-accent-color/10 text-accent-color rounded-lg hover:bg-accent-color/20 text-xs font-mono border border-accent-color/30"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      Add Paragraph
                    </button>
                  </div>
                  {aboutData.bio.map((paragraph, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        value={paragraph}
                        onChange={(e) => handleBioChange(index, e.target.value)}
                        placeholder={`Paragraph ${index + 1}`}
                        rows="3"
                        className="flex-1 bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                        style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                      />
                      {aboutData.bio.length > 1 && (
                        <button
                          onClick={() => removeBioParagraph(index)}
                          className="px-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 border border-red-500/30"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-lightbulb text-accent-color mr-2"></i>
                    Philosophy
                  </label>
                  <textarea
                    name="philosophy"
                    value={aboutData.philosophy}
                    onChange={handleAboutInputChange}
                    placeholder="Your philosophy or approach"
                    rows="4"
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none resize-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                </div>

                <button
                  onClick={handleAboutSave}
                  disabled={saveAboutMutation.isPending}
                  className="w-full px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                >
                  {saveAboutMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save About Section
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-accent-color font-mono flex items-center gap-3" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                <i className="fas fa-cogs"></i>
                Settings
              </h2>
            </div>

            {/* Site Toggle */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-accent-color font-mono mb-4 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                <i className="fas fa-toggle-on"></i>
                Site Status
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    Site is currently: <span className={siteSettings?.isActive ? 'text-green-500' : 'text-red-500'}>{siteSettings?.isActive ? 'Active' : 'Inactive'}</span>
                  </p>
                  <p className="text-sm text-text-secondary font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    {siteSettings?.isActive ? 'Visitors can access the website' : 'Site is in maintenance mode'}
                  </p>
                </div>
                <button
                  onClick={() => toggleSiteMutation.mutate()}
                  disabled={toggleSiteMutation.isPending}
                  className={`px-6 py-3 rounded-lg font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                    siteSettings?.isActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                >
                  {toggleSiteMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className={`fas ${siteSettings?.isActive ? 'fa-power-off' : 'fa-check'} mr-2`}></i>
                      {siteSettings?.isActive ? 'Deactivate Site' : 'Activate Site'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-accent-color font-mono mb-4 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                <i className="fas fa-key"></i>
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-lock text-accent-color mr-2"></i>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-key text-accent-color mr-2"></i>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password (min 8 chars, 1 special char)"
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2 font-mono" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                    <i className="fas fa-check-circle text-accent-color mr-2"></i>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="w-full bg-primary-bg/30 border border-accent-color/30 rounded-lg px-4 py-3 text-text-primary font-mono text-sm focus:border-accent-color focus:outline-none"
                    style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full px-6 py-3 bg-accent-color rounded-lg hover:bg-green-400 font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-accent-color font-mono flex items-center gap-3">
                <i className="fas fa-envelope"></i>
                Contact Messages
              </h2>
              <div className="flex items-center gap-2 text-xs text-text-secondary font-mono bg-secondary-bg/50 px-3 py-2 rounded-lg border border-accent-color/20">
                <i className="fas fa-inbox text-accent-color"></i>
                <span>{stats?.counts?.contacts?.total || 0} total messages</span>
              </div>
            </div>

            {/* Messages Placeholder */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md rounded-xl border border-accent-color/30 p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-accent-color/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-accent-color/30">
                <i className="fas fa-envelope-open-text text-4xl text-accent-color"></i>
              </div>
              <h3 className="text-xl font-semibold text-text-primary font-mono mb-3" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Message Management</h3>
              <p className="text-text-secondary font-mono mb-6 max-w-md mx-auto" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                View and manage contact form submissions. This feature is currently in development and will be available soon.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="px-4 py-2 bg-accent-color/10 rounded-lg border border-accent-color/30">
                  <p className="text-xs text-text-secondary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Total Messages</p>
                  <p className="text-2xl font-bold text-accent-color font-mono">{stats?.counts?.contacts?.total || 0}</p>
                </div>
                <div className="px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-xs text-text-secondary font-mono mb-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Unread</p>
                  <p className="text-2xl font-bold text-green-400 font-mono">{stats?.counts?.contacts?.unread || 0}</p>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl border border-purple-500/30 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-rocket text-purple-400 text-xl"></i>
                </div>
                <div>
                  <h4 className="text-text-primary font-mono font-semibold mb-2">Feature In Development</h4>
                  <p className="text-sm text-text-secondary font-mono leading-relaxed">
                    The message management interface will include features like: message viewing, filtering, search,
                    mark as read/unread, delete, and export functionality. Stay tuned for updates!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

