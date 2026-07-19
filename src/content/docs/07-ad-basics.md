---
title: "Module 7: Active Directory Basics"
description: Create organizational units, users, groups, and a shared folder with group-based permissions.
---

So far you have used the domain Administrator account for everything. In this module you create normal user accounts and use a security group to control access to a shared folder. This is the basic pattern behind most Active Directory environments.

## In This Module

- Create Organizational Units (OUs) to organize the domain
- Create two normal user accounts
- Create a security group and add a user to it
- Move CLIENT01 into a computer OU
- Create a shared folder on DC01 with group-based permissions
- Log in to CLIENT01 as a normal domain user and access the share

Keep DC01 and CLIENT01 running throughout this module. Sign in to DC01 as `LAB\Administrator` to complete the administrative work.

## Create the Organizational Units

An Organizational Unit, or OU, is a folder inside Active Directory. OUs keep users, groups, and computers organized. They also let you apply different Group Policy settings to different sets of objects, which you will do in Module 8.

1. On DC01, open **Server Manager > Tools > Active Directory Users and Computers**.
2. Expand **lab.internal**. The folders you see are the domain's built-in containers.
3. Right-click **lab.internal** and choose **New > Organizational Unit**.
4. Name it `Lab Users` and click OK. Keep **Protect container from accidental deletion** checked.
5. Repeat the process to create two more OUs:
   - `Lab Groups`
   - `Lab Computers`

You now have separate places for each type of object you will manage in this lab.

## Move CLIENT01 into Its OU

When CLIENT01 joined the domain, Active Directory placed it in the built-in **Computers** container. Move it into the OU you just created so you can target it with Group Policy later.

1. In Active Directory Users and Computers, click the built-in **Computers** container.
2. Right-click **CLIENT01** and choose **Move**.
3. Select **Lab Computers** and click OK.
4. Click **Lab Computers** and confirm CLIENT01 appears there.

Moving the computer object does not interrupt CLIENT01 or remove it from the domain.

## Create Normal User Accounts

Create two users so you can compare one account that has access to the shared folder with one that does not.

1. Right-click the **Lab Users** OU and choose **New > User**.
2. Enter:
   - **First name:** `Alex`
   - **Last name:** `Morgan`
   - **User logon name:** `amorgan`
3. Click Next and enter a temporary password. For this isolated lab you can use `Start-Lab!42`, but never reuse a real password.
4. Keep **User must change password at next logon** checked and click Next, then Finish.
5. Repeat the process for a second user:
   - **First name:** `Jamie`
   - **Last name:** `Chen`
   - **User logon name:** `jchen`
   - Use the same temporary lab password and keep the password-change option checked.

Both users are members of **Domain Users** automatically. That is enough to sign in to a domain-joined computer, but it does not give either user administrative rights.

## Create a Security Group

Permissions should be assigned to groups, not directly to individual users. When someone's job changes, you update their group membership instead of editing every folder they can access.

1. Right-click the **Lab Groups** OU and choose **New > Group**.
2. Set **Group name** to `GG-LabShare-Modify`.
3. Leave **Group scope** set to **Global** and **Group type** set to **Security**, then click OK.
4. Double-click the new group and open the **Members** tab.
5. Click **Add**, enter `amorgan`, and click **Check Names**. The name changes to Alex Morgan.
6. Click OK, then OK again.

The `GG` prefix is a simple reminder that this is a global group. The rest of the name describes what its members can do. Alex is a member; Jamie is deliberately left out so you can verify that the permission works.

## Create the Shared Folder

In a production environment, shared files normally live on a dedicated file server. DC01 will host this one to keep the lab small.

### Create the Folders

1. On DC01, open File Explorer and browse to `C:\`.
2. Create a folder named `Shares`.
3. Inside it, create a folder named `LabShare`.

The full path is `C:\Shares\LabShare`.

### Set NTFS Permissions

NTFS permissions control what a user can do with the folder and its files while logged in locally or over the network.

1. Right-click **LabShare**, choose **Properties**, and open the **Security** tab.
2. Click **Advanced**, then click **Disable inheritance**.
3. Choose **Convert inherited permissions into explicit permissions on this object**.
4. Remove entries for **Users** and **Authenticated Users** if either is listed. Do not remove **SYSTEM** or **Administrators**.
5. Click **Add > Select a principal**.
6. Enter `GG-LabShare-Modify`, click **Check Names**, then click OK.
7. Check **Modify** under Basic permissions. Leave **Applies to** set to **This folder, subfolders and files**.
8. Click OK, then click OK again to apply the changes.

The group now has permission to read, create, change, and delete files in this folder.

### Share the Folder

Sharing makes the folder reachable from other computers over the network.

1. In the LabShare Properties window, open the **Sharing** tab and click **Advanced Sharing**.
2. Check **Share this folder**. Keep the share name `LabShare`.
3. Click **Permissions**.
4. Select **Everyone** and click **Remove**.
5. Click **Add**, enter `GG-LabShare-Modify`, and click **Check Names**, then OK.
6. Under Allow, check **Change** and **Read**. Leave **Full Control** unchecked.
7. Click OK on each open window to save the share.

The network path is now `\\DC01\LabShare`.

:::note
Share permissions and NTFS permissions both apply to network access. Windows uses the more restrictive result. In this lab, both layers grant the same group the access it needs.
:::

## Test the Domain User and Share

1. On CLIENT01, sign out of the domain Administrator account.
2. At the login screen, select **Other user** and sign in as `LAB\amorgan` with the temporary password.
3. Windows asks you to change the password before signing in. Choose a new lab-only password and let Windows build the user profile.
4. Press Win + R, enter `\\DC01\LabShare`, and press Enter.
5. Right-click inside the folder and create a text document. Open it, add a line of text, save it, and delete it.

If all four actions work, the Modify permission is correct. Alex received access through membership in `GG-LabShare-Modify`, not through a permission assigned directly to the user.

To confirm which account is signed in, open Command Prompt and run:

```
whoami
```

It should return `lab\amorgan`.

### Optional: Confirm Access Is Denied

Sign out and sign in as `LAB\jchen` with the temporary password. After changing it, try to open `\\DC01\LabShare`. Windows should deny access because Jamie is not a member of the group. Sign back in as Alex when finished.

If Alex is denied too, sign out and back in to refresh the account's group membership. On DC01, also confirm Alex appears on the group's **Members** tab and that the group is listed in both the Sharing and Security permissions for LabShare.

## Use Normal Accounts Going Forward

Stay signed in to CLIENT01 as Alex for everyday lab work. Use `LAB\Administrator` only when a task needs administrative rights. Keeping normal work separate from administration limits the damage caused by mistakes and is standard practice in real environments.

## Take Snapshots

Shut down both VMs. Take a snapshot of DC01 named `AD users groups and share`, and a snapshot of CLIENT01 named `Normal domain user tested`.

## Checklist Before Moving On

- [ ] Lab Users, Lab Groups, and Lab Computers OUs exist
- [ ] CLIENT01 is in the Lab Computers OU
- [ ] Alex Morgan and Jamie Chen are in the Lab Users OU
- [ ] GG-LabShare-Modify exists and Alex is a member
- [ ] `\\DC01\LabShare` opens while signed in as LAB\amorgan
- [ ] Alex can create, edit, and delete a file in the share
- [ ] `whoami` returns lab\amorgan
- [ ] Snapshots taken

Continue to Module 8 to manage the domain with Group Policy.
