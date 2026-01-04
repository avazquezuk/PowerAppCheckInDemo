// Office 365 User Service
// Note: For Power Apps Code Apps, Office 365 Users connector cannot be accessed directly from code.
// Power Apps Code Apps don't expose connector APIs to JavaScript - connectors are only accessible
// through Power Fx in the Power Apps Studio environment.
// 
// For user identification, we'll rely on the Business Central employee lookup by email.

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
    // Power Apps Code Apps don't expose connector APIs to JavaScript
    // Return mock data for development
    // In production, user identification happens through BC employee lookup
    return this.mockProfile;
  }

  async getUserPhoto(): Promise<string> {
    // Power Apps Code Apps don't expose connector APIs to JavaScript
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
