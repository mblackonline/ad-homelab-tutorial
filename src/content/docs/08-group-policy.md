---
title: "Module 8: Group Policy"
description: Use Group Policy to set a company wallpaper and enforce a screen lock policy.
---

Group Policy lets an administrator configure many computers and users from one place. In this module you create one policy for the users in the Lab Users OU and another for the computers in the Lab Computers OU.

## In This Module

- Understand how Group Policy Objects (GPOs) apply
- Store a wallpaper where domain users can read it
- Create a user GPO that sets the desktop wallpaper
- Create a computer GPO that sets a 10-minute maximum inactivity limit
- Apply and verify both policies on CLIENT01

Keep DC01 and CLIENT01 running. Sign in to DC01 as `LAB\Administrator` and keep CLIENT01 signed in as `LAB\amorgan`.

## How Group Policy Works

A Group Policy Object is a collection of settings. Creating a GPO does not affect anything by itself. You must link it to a site, domain, or OU.

Each GPO has two main sections:

- **Computer Configuration** targets computer objects and affects the computer regardless of who signs in.
- **User Configuration** targets user objects and follows those users when they sign in to domain computers that can process the GPO.

The wallpaper policy will be linked to **Lab Users** because it is a user setting. The screen lock policy will be linked to **Lab Computers** because it should protect CLIENT01 no matter who signs in.

## Prepare the Wallpaper File

CLIENT01 must be able to read the image from a network path. The domain's SYSVOL share is a convenient location because domain users can read it by default.

1. On DC01, open File Explorer and browse to:

   ```text
   C:\Windows\Web\Wallpaper\Windows
   ```

2. Copy one of the `.jpg` images. If this folder has no images, use any JPG file available in your lab.
3. Browse to:

   ```text
   C:\Windows\SYSVOL\sysvol\lab.internal\scripts
   ```

4. Paste the image into this folder and rename it `lab-wallpaper.jpg`.
5. On CLIENT01, while signed in as `LAB\amorgan`, press Win + R and test the network path:

   ```text
   \\lab.internal\SYSVOL\lab.internal\scripts\lab-wallpaper.jpg
   ```

The image should open on CLIENT01. Group Policy will use this UNC path instead of the local `C:\` path because the file must be reachable by the user receiving the policy.

:::note
SYSVOL is suitable for this small lab file and is readable by domain users by default. In a domain with multiple controllers, SYSVOL content is replicated to every domain controller, so large collections of wallpaper or software files should be stored elsewhere.
:::

## Create the Wallpaper GPO

1. On DC01, open **Server Manager > Tools > Group Policy Management**.
2. Expand **Forest: lab.internal > Domains > lab.internal**.
3. Right-click the **Lab Users** OU and choose **Create a GPO in this domain, and Link it here**.
4. Name it `Lab - Desktop Wallpaper` and click OK.
5. Right-click the new GPO below Lab Users and choose **Edit**.
6. In Group Policy Management Editor, go to:

   ```text
   User Configuration
     Policies
       Administrative Templates
         Desktop
           Desktop
   ```

7. Double-click **Desktop Wallpaper** and select **Enabled**.
8. Set **Wallpaper Name** to:

   ```text
   \\lab.internal\SYSVOL\lab.internal\scripts\lab-wallpaper.jpg
   ```

9. Set **Wallpaper Style** to **Fill**, click Apply, then OK.
10. Close Group Policy Management Editor.
11. Back in Group Policy Management, expand **Group Policy Objects**, right-click `Lab - Desktop Wallpaper`, select **GPO Status**, and choose **Computer Settings Disabled**. This GPO contains only user settings, so disabling its unused half avoids unnecessary processing.

The GPO is linked to Lab Users, so it applies to both Alex and Jamie. It does not apply to the domain Administrator because that account is in a different container.

## Create the Screen Lock GPO

This policy sets 600 seconds, or 10 minutes, as the maximum period without user input before CLIENT01 locks. Windows may lock sooner if the screen saver activates or the display turns off. Locking does not sign the user out or close their programs; the user must enter their password to unlock the session.

1. In Group Policy Management, right-click the **Lab Computers** OU and choose **Create a GPO in this domain, and Link it here**.
2. Name it `Lab - 10 Minute Screen Lock` and click OK.
3. Right-click the new GPO below Lab Computers and choose **Edit**.
4. Go to:

   ```text
   Computer Configuration
     Policies
       Windows Settings
         Security Settings
           Local Policies
             Security Options
   ```

5. Double-click **Interactive logon: Machine inactivity limit**.
6. Check **Define this policy setting** and enter `600` seconds.
7. Click Apply, then OK, and close Group Policy Management Editor.
8. Back in Group Policy Management, expand **Group Policy Objects**, right-click `Lab - 10 Minute Screen Lock`, select **GPO Status**, and choose **User Settings Disabled**.

Because this is a computer setting linked to Lab Computers, it applies to CLIENT01 and every user who signs in there.

## Apply the Policies on CLIENT01

Domain computers refresh Group Policy automatically, but you do not need to wait for the normal refresh interval.

1. On CLIENT01, confirm you are signed in as `LAB\amorgan`.
2. Open Command Prompt and run:

   ```text
   gpupdate /force
   ```

3. Wait for both the computer and user policy updates to complete.
4. Restart CLIENT01. The machine inactivity setting requires a restart before it becomes effective.
5. Sign back in as `LAB\amorgan`.

The new wallpaper should appear after sign-in.

## Verify the Policies

### Check the Applied User GPO

On CLIENT01, open Command Prompt as Alex and run:

```text
gpresult /scope user /r
```

Under **Applied Group Policy Objects**, look for `Lab - Desktop Wallpaper`.

### Check the Applied Computer GPO

To see computer results, open Command Prompt as administrator:

1. Search for **Command Prompt**, right-click it, and choose **Run as administrator**.
2. Enter the credentials for `LAB\Administrator` if prompted.
3. Run:

   ```text
   gpresult /scope computer /r
   ```

Under **Applied Group Policy Objects**, look for `Lab - 10 Minute Screen Lock`.

You can also confirm the configured timeout by running:

```text
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v InactivityTimeoutSecs
```

The value should end in `0x258`, which is hexadecimal for 600 seconds. Leave CLIENT01 idle for 10 minutes if you want to test the lock itself.

## If a GPO Does Not Apply

Check these common causes:

- In Active Directory Users and Computers, Alex must be in **Lab Users** and CLIENT01 must be in **Lab Computers**.
- In Group Policy Management, the wallpaper GPO must be linked below **Lab Users** and the screen lock GPO below **Lab Computers**.
- CLIENT01 must use 10.0.10.10 as its only DNS server.
- The wallpaper must open from its UNC path on CLIENT01.
- Run `gpupdate /force`, then sign out and back in. Restart CLIENT01 for computer settings if needed.

Use `gpresult` after each check. If a GPO appears under **Applied Group Policy Objects**, Windows received it. Next, verify the configured setting and any dependency it uses, such as the wallpaper's UNC path.

## Take Snapshots

Shut down both VMs. Take a snapshot of DC01 named `Group Policy configured`, and a snapshot of CLIENT01 named `Group Policy applied`.

## Further Learning

- [Group Policy Overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-overview) explains GPO structure, user and computer settings, linking, and foreground and background processing.
- [Group Policy Management Console](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-management-console) covers creating, editing, linking, disabling, backing up, and reporting on GPOs.
- [Group Policy Processing](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing) explains processing order, inheritance, refresh behavior, security filtering, and loopback processing.
- The [`gpupdate`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpupdate) and [`gpresult`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpresult) command references document the refresh and reporting options used in this module.

## Checklist Before Moving On

- [ ] The wallpaper image opens from the SYSVOL UNC path on CLIENT01 as Alex
- [ ] `Lab - Desktop Wallpaper` is linked to `Lab Users`
- [ ] Alex's desktop shows the assigned wallpaper
- [ ] `Lab - 10 Minute Screen Lock` is linked to `Lab Computers`
- [ ] The unused computer half of the wallpaper GPO and user half of the screen-lock GPO are disabled
- [ ] The inactivity limit is 600 seconds
- [ ] `gpresult` lists both GPOs in their correct scopes
- [ ] Snapshots taken

Continue to Module 9 to add CLIENT02 and administer the domain remotely with RSAT.
