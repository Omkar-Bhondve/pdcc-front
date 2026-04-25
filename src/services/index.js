// Centralized service exports
import api from './api';
import authService from './auth.service';
import userService from './user.service';
import roleService from './role.service';
import masterService from './master.service';
import { dashboardService } from './dashboard.service';

// Centralized API client
export {
  api,
  authService,
  userService,
  roleService,
  masterService,
  dashboardService
};

// Default export for convenience
export default {
  api,
  authService,
  userService,
  roleService,
  masterService,
  dashboardService
};
