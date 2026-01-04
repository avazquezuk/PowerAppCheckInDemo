// Office 365 User Service
// This service provides user profile information
// In Power Apps, it uses the authenticated Power Apps user context
// In local development, it uses mock data

export interface Office365UserProfile {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
  jobTitle: string;
  department: string;
  mobilePhone: string;
}

export interface Office365UserPhoto {
  value: string; // Base64 encoded image
}

class Office365UserService {
  private mockProfile: Office365UserProfile = {
    id: 'user-123',
    displayName: 'John Doe',
    givenName: 'John',
    surname: 'Doe',
    userPrincipalName: 'john.doe@company.com',
    mail: 'john.doe@company.com',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    mobilePhone: '+1-555-0100',
  };

  private async getPowerAppsUserProfile(): Promise<Office365UserProfile | null> {
    try {
      // Try to get user from Power Apps context
      if (typeof window !== 'undefined') {
        const powerAppsContext = (window as any).PowerAppsContext;
        
        if (powerAppsContext && powerAppsContext.user) {
          const user = powerAppsContext.user;
          
          return {
            id: user.id || user.userId || 'unknown',
            displayName: user.displayName || user.fullName || 'Power Apps User',
            givenName: user.givenName || user.firstName || '',
            surname: user.surname || user.lastName || '',
            userPrincipalName: user.userPrincipalName || user.email || '',
            mail: user.email || user.mail || user.userPrincipalName || '',
            jobTitle: user.jobTitle || '',
            department: user.department || '',
            mobilePhone: user.mobilePhone || user.phone || '',
          };
        }

        // Try alternate Power Apps user context location
        const msalContext = (window as any).msal;
        if (msalContext && msalContext.currentUser) {
          const user = msalContext.currentUser;
          
          return {
            id: user.localAccountId || user.homeAccountId || 'unknown',
            displayName: user.name || 'Power Apps User',
            givenName: user.givenName || '',
            surname: user.surname || '',
            userPrincipalName: user.username || '',
            mail: user.username || '',
            jobTitle: '',
            department: '',
            mobilePhone: '',
          };
        }

        // Try Office context
        if ((window as any).Office && (window as any).Office.context) {
          const mailbox = (window as any).Office.context.mailbox;
          if (mailbox && mailbox.userProfile) {
            const user = mailbox.userProfile;
            
            return {
              id: user.accountId || 'unknown',
              displayName: user.displayName || 'Office User',
              givenName: '',
              surname: '',
              userPrincipalName: user.emailAddress || '',
              mail: user.emailAddress || '',
              jobTitle: '',
              department: '',
              mobilePhone: '',
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Error getting Power Apps user profile:', error);
      return null;
    }
  }

  async getMyProfile(): Promise<Office365UserProfile> {
    // Try to get actual user from Power Apps context
    const powerAppsProfile = await this.getPowerAppsUserProfile();
    
    if (powerAppsProfile) {
      console.log('Using Power Apps user profile:', powerAppsProfile.displayName);
      return powerAppsProfile;
    }
    
    // Fall back to mock data for local development
    console.log('Using mock user profile (development mode)');
    return this.mockProfile;
  }

  async getUserPhoto(): Promise<string> {
    // Photo not available through Power Apps context
    return '';
  }

  async getPhotoUrl(): Promise<string | null> {
    const photo = await this.getUserPhoto();
    if (photo) {
      return `data:image/jpeg;base64,${photo}`;
    }
    return null;
  }
}

export const office365UserService = new Office365UserService();
