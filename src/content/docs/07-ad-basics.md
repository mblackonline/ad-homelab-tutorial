---
title: "Module 7: Active Directory Basics"
description: Create organizational units, users, groups, and a shared folder with group-based permissions.
---

So far you have used the domain Administrator account for everything. In this module you create normal user accounts and use nested security groups to control access to a shared folder. This introduces a standard pattern for managing access in a single-domain Active Directory environment.

## In This Module

- Create Organizational Units (OUs) to organize the domain
- Create two normal user accounts
- Create global and domain local security groups
- Move CLIENT01 into a computer OU
- Create a shared folder on DC01 with group-based permissions
- Log in to CLIENT01 as a normal domain user and access the share

Keep DC01 and CLIENT01 running throughout this module. Sign in to DC01 as `LAB\Administrator` to complete the administrative work.

## Create the Organizational Units

An Organizational Unit, or OU, is an Active Directory container that works much like a folder. OUs organize users, groups, and computers. They can also be used to delegate administrative tasks and apply Group Policy settings to selected objects. You will use them with Group Policy in Module 8.

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
3. Click Next and enter a temporary password. For this isolated lab, you can use `Cedar-Lab!42`. Never reuse a real password.
4. Keep **User must change password at next logon** checked and click Next, then Finish.
5. Repeat the process for a second user:
   - **First name:** `Jamie`
   - **Last name:** `Chen`
   - **User logon name:** `jchen`
   - Use a different temporary lab-only password, such as `Orbit-Lab!57`, and keep the password-change option checked.

Keep track of both temporary passwords because each one is used once during the sign-in tests later in this module.

Both users are members of **Domain Users** automatically. That is enough to sign in to a domain-joined computer, but it does not give either user administrative rights.

## Create the Security Groups

Access permissions are generally assigned to security groups instead of directly to individual users. A standard single-domain design separates groups that represent people or roles from groups that hold permissions to resources.

1. Right-click the **Lab Groups** OU and choose **New > Group**.
2. Set **Group name** to `GG-LabShare-Editors`.
3. Leave **Group scope** set to **Global** and **Group type** set to **Security**, then click OK.
4. Double-click the new group and open the **Members** tab.
5. Click **Add**, enter `amorgan`, and click **Check Names**. The name changes to Alex Morgan.
6. Click OK, then OK again.
7. Right-click the **Lab Groups** OU and choose **New > Group** again.
8. Set **Group name** to `DL-LabShare-Modify`.
9. Select **Domain Local** for the group scope, keep **Security** selected, and click OK.
10. Double-click `DL-LabShare-Modify` and open the **Members** tab.
11. Click **Add**, enter `GG-LabShare-Editors`, and click **Check Names**.
12. Click OK, then OK again.

This arrangement is commonly remembered as **AGDLP**:

- **A, Accounts:** `amorgan`
- **G, Global group:** `GG-LabShare-Editors`
- **DL, Domain Local group:** `DL-LabShare-Modify`
- **P, Permissions:** Modify access to LabShare

The global group answers who belongs to the role. The domain local group identifies the resource and permission. Alex is added to the global group, the global group is nested inside the domain local group, and only the domain local group will be assigned permissions. Jamie is deliberately left out so you can test that access is restricted.

## Create the Shared Folder

In a production environment, shared files typically live on a member file server instead of a domain controller. DC01 will host this share to keep the lab small.

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
6. Enter `DL-LabShare-Modify`, click **Check Names**, then click OK.
7. Check **Modify** under Basic permissions. Leave **Applies to** set to **This folder, subfolders and files**.
8. Click OK to close **Advanced Security Settings**. Keep the LabShare Properties window open for the next section.

The group now has permission to read, create, change, and delete files in this folder.

### Share the Folder

Sharing makes the folder reachable from other computers over the network.

1. In the LabShare Properties window, open the **Sharing** tab and click **Advanced Sharing**.
2. Check **Share this folder**. Keep the share name `LabShare`.
3. Click **Permissions**.
4. Select **Everyone** and click **Remove**.
5. Click **Add**, enter `DL-LabShare-Modify`, and click **Check Names**, then OK.
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

If you can create, edit, save, and delete the file, the Modify permission is working. Alex receives access through `GG-LabShare-Editors`, which is a member of `DL-LabShare-Modify`. No permission was assigned directly to Alex.

To confirm which account is signed in, open Command Prompt and run:

```text
whoami
```

It should return `lab\amorgan`.

### Optional: Confirm Access Is Denied

Sign out and sign in as `LAB\jchen` with the temporary password. After changing it, try to open `\\DC01\LabShare`. Windows should deny access because Jamie is not a member of the group. Sign back in as Alex when finished.

If Alex is denied too, sign out and back in to refresh the account's group membership. On DC01, confirm that Alex is a member of `GG-LabShare-Editors`, that the global group is a member of `DL-LabShare-Modify`, and that the domain local group is listed in both the Sharing and Security permissions for LabShare.

## Use Normal Accounts Going Forward

Stay signed in to CLIENT01 as Alex for everyday lab work. Use `LAB\Administrator` only when a task needs administrative rights. Keeping normal work separate from administration limits the damage caused by mistakes and is standard practice in real environments.

## Further Learning

- [Manage User Accounts with Active Directory Users and Computers](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage-user-accounts-in-windows-server) covers creating users, managing group membership, resetting passwords, and other account tasks in Windows Server 2025.
- [Active Directory Security Groups](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups) explains the security-group scopes and nesting rules used by the AGDLP pattern.
- [Default Containers and Organizational Units](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/delegating-administration-of-default-containers-and-ous) explains where new accounts are placed and why custom OUs are used for delegation and Group Policy.
- [Windows Access Control Overview](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control) introduces permissions, inheritance, ownership, security identifiers, and access control lists.
- [SMB File Sharing Overview](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview) explains how Windows clients and servers use SMB to access paths such as `\\server\share`.

## Checklist Before Moving On

- [ ] `Lab Users`, `Lab Groups`, and `Lab Computers` OUs exist
- [ ] CLIENT01 is in the `Lab Computers` OU
- [ ] Alex Morgan and Jamie Chen are in the `Lab Users` OU
- [ ] `GG-LabShare-Editors` exists and Alex is a member
- [ ] `DL-LabShare-Modify` exists and contains `GG-LabShare-Editors`
- [ ] `\\DC01\LabShare` opens while signed in as `LAB\amorgan`
- [ ] Alex can create, edit, and delete a file in the share
- [ ] `whoami` returns `lab\amorgan`

Continue to Module 8 to manage the domain with Group Policy.
