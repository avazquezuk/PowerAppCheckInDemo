// Office 365 User Service
// Note: For Power Apps Code Apps, you need to:
// 1. Create an Office 365 Users connection in Power Apps portal
// 2. Add it to your app via the Data panel in Power Apps Studio

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

  async getMyProfile(): Promise<Office365UserProfile> {
    // For Code Apps, connectors need to be added through Power Apps Studio
    // This is a placeholder that uses mock data until the connector is properly configured
    // Once configured, you can access it via the Power Apps runtime environment
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.mockProfile), 500);
    });
  }

  async getUserPhoto(): Promise<string> {
    // For Code Apps, connectors need to be added through Power Apps Studio
    // This is a placeholder that returns empty string (will show initials)
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(''), 500);
    });
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
