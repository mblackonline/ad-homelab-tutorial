---
title: "Module 9: CLIENT02 and RSAT (Optional)"
description: Add a second client and learn to manage Active Directory from a workstation instead of the server.
---

This optional module adds a second Windows 11 client and turns CLIENT01 into an administrative workstation. You will use Remote Server Administration Tools (RSAT) to manage the domain without working directly on DC01.

:::note
You do not need to run all three VMs at once. Run DC01 with one client, then shut down that client before starting the other. If your host has only 8 GB of RAM, keep DC01 and the active client at 3072 MB each and close other host applications.
:::

## In This Module

- Build and join a second client named CLIENT02
- Install selected RSAT tools on CLIENT01
- Run the tools with an administrator account while signed in as a normal user
- Move CLIENT02 into the correct OU from CLIENT01
- Verify DHCP, DNS, Active Directory, and Group Policy remotely
- Confirm the existing user, share, and policies also work on CLIENT02

## Build CLIENT02

Build CLIENT02 from the Windows 11 ISO just as you built CLIENT01 in Module 6.

:::caution
Do not clone the domain-joined CLIENT01 VM. A clone would copy its computer identity and domain configuration. Creating CLIENT02 from the ISO avoids duplicate identity and trust problems.
:::

1. Start DC01 and leave CLIENT01 powered off.
2. In VirtualBox Manager, click **New** and configure:
   - **Name:** `CLIENT02`
   - **ISO Image:** the Windows 11 Enterprise evaluation ISO
   - Check **Skip Unattended Installation**
   - **Base Memory:** 4096 MB, or 3072 MB on an 8 GB host
   - **Processors:** 2
   - Check **Enable EFI**
   - **Hard Disk:** 64 GB
3. Before starting the VM, open **Settings > System** and confirm:
   - **TPM:** v2.0
   - **Enable Secure Boot:** checked
4. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum. This gives the Windows desktop more display memory and can make the interface feel smoother.
5. Open **Settings > Network** and attach Adapter 1 to the **ADLab** NAT Network.
6. Start CLIENT02 and install Windows 11 Enterprise.
7. During setup, choose **Sign-in options > Domain join instead** and create a local account such as `localadmin`.
8. Install Guest Additions from **Devices > Insert Guest Additions CD image**, then restart.

## Confirm Networking and Join the Domain

On CLIENT02, open Command Prompt and run:

```text
ipconfig /all
```

Confirm the Ethernet adapter shows:

- An IPv4 address between 10.0.10.100 and 10.0.10.200
- DHCP server 10.0.10.10
- DNS server 10.0.10.10

Then join the domain:

1. Press Win + R, enter `sysdm.cpl`, and press Enter.
2. On the Computer Name tab, click **Change**.
3. Set **Computer name** to `CLIENT02`.
4. Select **Member of: Domain** and enter `lab.internal`.
5. When prompted, enter `LAB\Administrator` and its password.
6. After the welcome message appears, restart CLIENT02.
7. Shut down CLIENT02 after the restart. You will move its computer object into the correct OU from CLIENT01.

If the domain join fails, check the DNS server first. CLIENT02 must use only 10.0.10.10 for DNS.

## Install RSAT on CLIENT01

RSAT is a collection of Windows administrative consoles. On Windows 11 it is included as optional features instead of a separate download.

1. Leave DC01 running, keep CLIENT02 powered off, and start CLIENT01.
2. Sign in to CLIENT01 as `LAB\amorgan`.
3. Open **Settings > System > Optional features**.
4. Next to **Add an optional feature**, click **View features**. The exact button wording may differ slightly by Windows 11 version.
5. Search for `RSAT` and select:
   - **RSAT: Active Directory Domain Services and Lightweight Directory Services Tools**
   - **RSAT: Group Policy Management Tools**
   - **RSAT: DHCP Server Tools**
   - **RSAT: DNS Server Tools**
6. Click Next, then **Add** or **Install**. Enter `LAB\Administrator` credentials if Windows asks for approval.
7. Wait for all four features to show as installed.

The installation downloads components from Microsoft. If it fails, confirm CLIENT01 can browse the internet and that DC01 can resolve internet names through its DNS forwarder.

## Run RSAT with Administrator Credentials

Alex remains your everyday account. Open administrative tools with the domain Administrator only when you need elevated rights.

1. On CLIENT01, open Command Prompt.
2. Run:

   ```text
   runas /user:LAB\Administrator "mmc.exe dsa.msc"
   ```

3. Enter the domain Administrator password when prompted. The password does not appear while you type.

Active Directory Users and Computers opens from CLIENT01, but it connects to the directory on DC01. This is remote administration: the console runs locally while the service and data remain on the server.

## Move CLIENT02 into Lab Computers

Use the Active Directory Users and Computers console you opened with `runas`:

1. Expand **lab.internal** and select the built-in **Computers** container.
2. Confirm CLIENT02 is listed. CLIENT01 is already in Lab Computers from Module 7.
3. Right-click **CLIENT02** and choose **Move**.
4. Select **Lab Computers** and click OK.
5. Open Lab Computers and confirm both client objects appear there.

You have now performed an Active Directory administration task from a workstation instead of signing in to the domain controller.

## Explore the Other Tools

Open each console from a Command Prompt on CLIENT01 using the domain Administrator account.

### Group Policy Management

```text
runas /user:LAB\Administrator "mmc.exe gpmc.msc"
```

Expand **Forest: lab.internal > Domains > lab.internal**. Confirm the wallpaper GPO is linked to Lab Users and the screen lock GPO is linked to Lab Computers.

### DHCP

```text
runas /user:LAB\Administrator "mmc.exe dhcpmgmt.msc"
```

Expand `dc01.lab.internal`, then open the IPv4 scope and **Address Leases**. You should see leases for CLIENT01 and CLIENT02. A powered-off client may still have an active lease, which is normal.

If DC01 does not appear automatically, right-click **DHCP** and choose **Add Server**, then select or enter `dc01.lab.internal`.

### DNS

```text
runas /user:LAB\Administrator "mmc.exe dnsmgmt.msc"
```

Expand DC01, then **Forward Lookup Zones > lab.internal**. Look for host records for DC01 and the clients.

If the server does not appear automatically, right-click **DNS**, choose **Connect to DNS Server**, and enter `dc01.lab.internal`.

## Test CLIENT02

1. Shut down CLIENT01 if your host is short on RAM, then start CLIENT02. Keep DC01 running.
2. Sign in to CLIENT02 as `LAB\amorgan`.
3. Open Command Prompt and run:

   ```text
   gpupdate /force
   ```

4. Sign out and back in if the wallpaper does not appear immediately.
5. Run `whoami` and confirm it returns `lab\amorgan`.
6. Press Win + R and open `\\DC01\LabShare`. Confirm you can create and delete a test file.
7. Open an administrator Command Prompt and run:

   ```text
   gpresult /scope computer /r
   ```

8. Confirm `Lab - 10 Minute Screen Lock` appears under Applied Group Policy Objects.

The same user account, file access, and policies now follow Alex to either domain computer. That centralized experience is the reason organizations use Active Directory.

## Take Snapshots

Shut down the VMs and take these snapshots:

- DC01: `Two clients configured`
- CLIENT01: `RSAT installed`
- CLIENT02: `Domain joined and policies applied`

## Checklist

- [ ] CLIENT02 receives DHCP and DNS settings from DC01
- [ ] CLIENT02 is joined to lab.internal and is in Lab Computers
- [ ] The four selected RSAT features are installed on CLIENT01
- [ ] Active Directory Users and Computers opens from CLIENT01
- [ ] Group Policy, DHCP, and DNS can be viewed remotely
- [ ] LAB\amorgan can sign in to CLIENT02 and access the shared folder
- [ ] The wallpaper and screen lock GPOs apply to CLIENT02
- [ ] Snapshots taken

The main lab is complete. Continue to the appendix for snapshot strategy, evaluation rearm instructions, and troubleshooting help.
