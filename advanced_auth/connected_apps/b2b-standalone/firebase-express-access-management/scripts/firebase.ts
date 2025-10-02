import { readFileSync, existsSync } from 'fs';
import inquirer from 'inquirer';
import { join } from 'path';

type FirebaseSetupResult = {
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  apiKey: string;
};

// Validate Firebase project ID format
function validateProjectId(projectId: string): boolean {
  if (!projectId || projectId.length < 6) {
    return false;
  }
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    return false;
  }
  return true;
}

// Main setup function
async function performFirebaseSetup(): Promise<FirebaseSetupResult> {
  console.log('This script will guide you through setting up Firebase for your project.\n');

  // Get Firebase project information
  const { projectId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectId',
      message: 'Enter your Firebase project ID:',
      validate: (input: string) => {
        if (!validateProjectId(input)) {
          return 'Project ID must be at least 6 characters long and contain only lowercase letters, numbers, and hyphens';
        }
        return true;
      },
    },
  ]);

  console.log(`\nUsing Firebase project: ${projectId}`);

  // Get web app configuration
  console.log('\n📱 Web App Configuration');
  console.log('Go to your Firebase Console and create a web app:');
  console.log(`https://console.firebase.google.com/project/${projectId}/settings/general`);
  console.log("\nAfter creating the web app, you'll get a config object. Please enter the following values:");

  const webAppConfig = await inquirer.prompt([
    {
      type: 'input',
      name: 'apiKey',
      message: 'API Key:',
      validate: (input: string) => (input ? true : 'API Key is required'),
    },
  ]);

  // Service account key setup
  console.log('\n🔑 Service Account Key Setup');
  console.log('To generate a service account key:');
  console.log(
    '1. Go to: https://console.firebase.google.com/project/' + projectId + '/settings/serviceaccounts/adminsdk',
  );
  console.log('2. Click "Generate new private key"');
  console.log('3. Download the JSON file');
  console.log('4. Save it as "firebase-adminsdk.json" in your project root');

  const { hasServiceAccount } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'hasServiceAccount',
      message: 'Have you downloaded the service account key?',
      default: false,
    },
  ]);

  if (!hasServiceAccount) {
    console.log('\n⚠️  Please download the service account key first, then run this script again.');
    console.log('The key should be saved as "firebase-adminsdk.json" in your project root.');
    process.exit(1);
  }

  // Check if service account file exists
  const serviceAccountPath = join(process.cwd(), 'firebase-adminsdk.json');
  if (!existsSync(serviceAccountPath)) {
    console.log('\n❌ Service account key file not found.');
    console.log('Please save the downloaded JSON file as "firebase-adminsdk.json" in your project root.');
    process.exit(1);
  }

  // Validate service account file
  let serviceAccount: any;
  try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    if (!serviceAccount.project_id || serviceAccount.project_id !== projectId) {
      console.log('\n❌ Service account key project ID does not match your Firebase project ID.');
      console.log(`Expected: ${projectId}, Found: ${serviceAccount.project_id}`);
      process.exit(1);
    }
    console.log('✓ Service account key validated');
  } catch (error) {
    console.log('\n❌ Invalid service account key file. Please check the JSON format.');
    process.exit(1);
  }

  // when constructing the result, make sure that the private key is wrapped in quotes and contains all of the \n characters
  const privateKey = `"${serviceAccount.private_key.replace(/\n/g, '\\n')}"`;

  const result: FirebaseSetupResult = {
    projectId: projectId,
    apiKey: webAppConfig.apiKey,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: privateKey,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
  };

  // Final instructions
  console.log('\n🎉 Firebase setup complete!');
  console.log('\nNext steps:');
  console.log('1. Enable Authentication in Firebase Console:');
  console.log(`   https://console.firebase.google.com/project/${projectId}/authentication/providers`);
  console.log('   - Go to Authentication > Sign-in method');
  console.log('   - Enable "Email/Password" provider');
  console.log('\n2. Enable Firestore Database:');
  console.log(`   https://console.firebase.google.com/project/${projectId}/firestore`);
  console.log('   - Click "Create database"');
  console.log('   - Choose "Start in production mode"');
  console.log('   - Select a location (e.g., us-central1)');
  console.log('   - Click "Add Index"');
  console.log(
    '   - Add the following composite indexes for the `accessRequests` collection (scoped to the Collection):',
  );
  console.log('     - orgId ASC, status ASC, createdAt DESC, __name__ DESC');
  console.log('     - orgId ASC, createdAt DESC, __name__ DESC');
  console.log('     - userId ASC, status ASC, createdAt DESC, __name__ DESC');
  console.log('     - userId ASC, createdAt DESC, __name__ DESC');
  console.log('   - Click "Save"');

  console.log('\n📋 Configuration Summary:');
  console.log(`Project ID: ${result.projectId}`);
  console.log(`API Key: ${result.apiKey}`);
  console.log(`Private Key ID: ${result.privateKeyId}`);
  console.log(`Private Key: ${result.privateKey}`);
  console.log(`Client Email: ${result.clientEmail}`);
  console.log(`Client ID: ${result.clientId}`);

  return result;
}

export default performFirebaseSetup;
export type { FirebaseSetupResult };
