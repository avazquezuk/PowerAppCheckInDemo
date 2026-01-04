/**
 * Power Apps Office 365 Users Connector Service
 * 
 * This service uses the Office 365 Users connector through Power Apps connection reference.
 */

import { PowerAppsConnector } from './PowerAppsConnector';
import { Office365UserProfile } from '../Office365UserService';

export class PowerAppsOffice365Service extends PowerAppsConnector {
  constructor() {
    super({
      connectionReference: import.meta.env.VITE_OFFICE365_CONNECTION_REF || 'Office365Users'
    });
  }

  /**
   * Get current user's profile from Office 365
   */
  async getMyProfile(): Promise<Office365UserProfile> {
    try {
      const profile: any = await this.executeAction('MyProfile', {});
      
      return {
        id: profile.Id || '',
        displayName: profile.DisplayName || '',
        givenName: profile.GivenName || '',
        surname: profile.Surname || '',
        userPrincipalName: profile.UserPrincipalName || '',
        mail: profile.Mail || profile.UserPrincipalName || '',
        jobTitle: profile.JobTitle || '',
        department: profile.Department || '',
        mobilePhone: profile.MobilePhone || '',
      };
    } catch (error) {
      console.error('Failed to get Office 365 profile:', error);
      throw new Error('Failed to retrieve Office 365 user profile');
    }
  }

  /**
   * Get user's photo from Office 365
   */
  async getUserPhoto(userPrincipalName?: string): Promise<string> {
    try {
      const params = userPrincipalName ? { user: userPrincipalName } : {};
      const result: any = await this.executeAction('UserPhoto', params);
      return result?.value || '';
    } catch (error) {
      console.warn('Failed to get user photo:', error);
      return '';
    }
  }

  /**
   * Get user photo as data URL
   */
  async getPhotoUrl(userPrincipalName?: string): Promise<string | null> {
    const photo = await this.getUserPhoto(userPrincipalName);
    if (photo) {
      return `data:image/jpeg;base64,${photo}`;
    }
    return null;
  }
}
