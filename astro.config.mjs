// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'ADDS Homelab Guide',
      description:
        'A beginner-friendly guide to building an Active Directory homelab with VirtualBox.',
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Welcome', slug: '' },
            { label: 'Module 1: Prerequisites', slug: '01-prerequisites' },
          ],
        },
        {
          label: 'Build the Lab',
          items: [
            { label: 'Module 2: VirtualBox Setup', slug: '02-virtualbox-setup' },
            { label: 'Module 3: Build the Server (DC01)', slug: '03-build-dc01' },
            { label: 'Module 4: Promote to Domain Controller', slug: '04-promote-to-dc' },
            { label: 'Module 5: DHCP', slug: '05-dhcp' },
            { label: 'Module 6: Build and Join CLIENT01', slug: '06-build-client01' },
          ],
        },
        {
          label: 'Learn to Administer',
          items: [
            { label: 'Module 7: Active Directory Basics', slug: '07-ad-basics' },
            { label: 'Module 8: Group Policy', slug: '08-group-policy' },
            { label: 'Module 9: CLIENT02 and RSAT (Optional)', slug: '09-client02-rsat' },
          ],
        },
        {
          label: 'Appendix',
          items: [{ autogenerate: { directory: 'appendix' } }],
        },
      ],
    }),
  ],
});
