---
title: "Module 9: CLIENT02 and RSAT (Optional)"
description: Add a second client and learn to manage Active Directory from a workstation instead of the server.
---

This optional module adds a second Windows 11 client and uses CLIENT01 to demonstrate remote administration. You will use Remote Server Administration Tools (RSAT) to manage the domain without working directly on DC01.

:::note
You do not need to run all three VMs at once. Run DC01 with one client, then shut down that client before starting the other. If your host has only 8 GB of RAM, leave the active Windows 11 client at 4096 MB and temporarily reduce DC01 to 2048 MB. Change memory only while a VM is powered off, and close other host applications.
:::

## In This Module

- Build CLIENT02 and take its clean-build snapshot before joining the domain
- Join CLIENT02 to the domain
- Install selected RSAT tools on CLIENT01
- Run the tools with an administrator account while signed in as a normal user
- Move CLIENT02 into the correct OU from CLIENT01
- Verify DHCP, DNS, Active Directory, and Group Policy remotely
- Confirm the existing user, share, and policies also work on CLIENT02

## Build CLIENT02

Build CLIENT02 from the Windows 11 ISO just as you built CLIENT01 in Module 6.

:::caution
Do not clone the domain-joined CLIENT01 VM. A reusable Windows image must be generalized before it is copied to another computer. Creating CLIENT02 from the ISO avoids adding an imaging and generalization workflow to this lab.
:::

1. Start DC01 and leave CLIENT01 powered off.
2. In VirtualBox Manager, click **New** and configure:
   - **Name:** `CLIENT02`
   - **ISO Image:** the Windows 11 Enterprise evaluation ISO
   - Choose a manual installation. Depending on the VirtualBox version, check **Skip Unattended Installation** or clear **Install OS Using Unattended Installation**
   - **Base Memory:** 4096 MB
   - **Processors:** 2
   - Check **Enable EFI** or **UEFI**, depending on the VirtualBox version
   - **Hard Disk:** 64 GB
3. Before starting the VM, open **Settings > System** and confirm:
   - **TPM Version:** 2.0
   - **Enable Secure Boot:** checked
4. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum. This gives the Windows desktop more display memory and can make the interface feel smoother.
5. Open **Settings > Network** and attach Adapter 1 to the **ADLab** NAT Network.
6. Start CLIENT02 and install Windows 11 Enterprise.
7. During setup, choose **Set up for work or school** if prompted, then select **Sign-in options > Domain join instead** and create a local account such as `localadmin`.
8. Install Guest Additions from **Devices > Insert Guest Additions CD image**, then restart.
9. Run Windows Update until no additional required updates are offered.

## Take the CLIENT02 Clean-Build Snapshot

Before joining CLIENT02 to the domain, save its clean checkpoint:

1. Shut down CLIENT02 from inside Windows.
2. In VirtualBox Manager, select CLIENT02, open **Snapshots**, and take a snapshot named `Clean install - before domain join`.
3. Start CLIENT02 again.

Keep this snapshot as a client rebuild point. Do not take additional snapshots after CLIENT02 joins the domain.

## Confirm Networking and Join the Domain

On CLIENT02, open Command Prompt and run:

```text
ipconfig /all
```

Confirm the Ethernet adapter shows:

- An IPv4 address between `10.0.10.100` and `10.0.10.200`
- Default gateway `10.0.10.1`
- DHCP server `10.0.10.10`
- DNS server `10.0.10.10`

Confirm that CLIENT02 can find the domain controller:

```text
nslookup dc01.lab.internal
```

The answer should show `10.0.10.10`.

Then join the domain:

1. Press Win + R, enter `sysdm.cpl`, and press Enter.
2. On the Computer Name tab, click **Change**.
3. Set **Computer name** to `CLIENT02`.
4. Select **Member of: Domain** and enter `lab.internal`.
5. When prompted, enter `LAB\Administrator` and its password.
6. After the welcome message appears, restart CLIENT02.
7. Shut down CLIENT02 after the restart. You will move its computer object into the correct OU from CLIENT01.

If the domain join fails, confirm DC01 is running and that CLIENT02 lists only `10.0.10.10` for DNS. See the [troubleshooting appendix](/appendix/troubleshooting/) if the problem continues.

## Install RSAT on CLIENT01

RSAT is a collection of Windows administrative consoles. On Windows 11 Enterprise it is installed as Features on Demand instead of from a separate download. Installing RSAT adds the tools but does not grant permission to manage a server.

1. Leave DC01 running, keep CLIENT02 powered off, and start CLIENT01.
2. Sign in to CLIENT01 as `LAB\amorgan`.
3. Open **Settings > System > Optional features**.
4. Next to **Add an optional feature**, click **View features**. The exact button wording may differ slightly by Windows 11 version.
5. Search for `RSAT` and select:
   - **RSAT: Active Directory Domain Services and Lightweight Directory Services Tools**
   - **RSAT: Group Policy Management Tools**
   - **RSAT: DHCP Server Tools**
   - **RSAT: DNS Server Tools**
6. Click Next, then **Add** or **Install**. If Windows asks for approval, enter the local administrator credentials created in Module 6, such as `CLIENT01\localadmin`.
7. Wait for all four features to show as installed.

The installation downloads components from Microsoft. If it fails, confirm CLIENT01 can browse the internet and that DC01 can resolve internet names through its DNS forwarder.

## Run RSAT with Administrator Credentials

Alex remains your everyday account. Open administrative tools with the domain Administrator only when you need elevated rights.

:::caution
This isolated lab uses the built-in domain Administrator to keep the exercise manageable. A production environment should use separate administrative identities with delegated permissions and secured administrative hosts. Using `runas /netonly` below separates the local and remote identities, but it does not make an ordinary workstation a secure privileged workstation.
:::

1. On CLIENT01, open Command Prompt.
2. Run:

   ```text
   runas /netonly /user:LAB\Administrator "mmc.exe dsa.msc"
   ```

3. Enter the domain Administrator password when prompted. The password does not appear while you type.

The `/netonly` option keeps the console in Alex's local session and uses the supplied Administrator credentials only for remote connections. It does not verify the password before opening the console, so an incorrect password causes the connection to DC01 to fail.

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
runas /netonly /user:LAB\Administrator "mmc.exe gpmc.msc"
```

Expand **Forest: lab.internal > Domains > lab.internal**. Confirm the wallpaper GPO is linked to Lab Users and the screen lock GPO is linked to Lab Computers.

### DHCP

```text
runas /netonly /user:LAB\Administrator "mmc.exe dhcpmgmt.msc"
```

Expand `dc01.lab.internal`, then open the IPv4 scope and **Address Leases**. CLIENT02's lease should be present. CLIENT01 also appears if its lease has not expired; powering off a client does not immediately remove its active lease.

If DC01 does not appear automatically, right-click **DHCP** and choose **Add Server**, then select or enter `dc01.lab.internal`.

### DNS

```text
runas /netonly /user:LAB\Administrator "mmc.exe dnsmgmt.msc"
```

Expand DC01, then **Forward Lookup Zones > lab.internal**. Confirm DC01's host record is present and review any client host records that have registered dynamically.

If the server does not appear automatically, right-click **DNS**, choose **Connect to DNS Server**, and enter `dc01.lab.internal`.

## Test CLIENT02

1. Shut down CLIENT01 if your host is short on RAM, then start CLIENT02. Keep DC01 running.
2. Sign in to CLIENT02 as `LAB\amorgan`.
3. Open Command Prompt and run:

   ```text
   gpupdate /force
   ```

4. Restart CLIENT02 so the machine inactivity policy can become effective, then sign back in as `LAB\amorgan`.
5. Confirm the wallpaper appears.
6. Run `whoami` and confirm it returns `lab\amorgan`.
7. Press Win + R and open `\\DC01\LabShare`. Confirm you can create and delete a test file.
8. Open an administrator Command Prompt and run:

   ```text
   gpresult /scope computer /r
   ```

9. Confirm `Lab - 10 Minute Screen Lock` appears under **Applied Group Policy Objects**.

The same user account, file access, and policies now follow Alex to either domain computer. That centralized experience is the reason organizations use Active Directory.

## Future Lab Idea: Add a Second Domain Controller

This guide uses one domain controller to keep the hardware requirements manageable. A useful future extension would add a second domain controller so you can practice Active Directory and DNS replication, explore service redundancy, and observe what happens when one controller is unavailable.

## Further Learning

- [Install and Manage Remote Server Administration Tools](https://learn.microsoft.com/en-us/windows-server/administration/install-remote-server-administration-tools) lists the available RSAT components and documents graphical and PowerShell installation methods for Windows 11.
- [Sysprep Overview](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview?view=windows-11) explains how Windows installations are generalized before they are captured and deployed to other computers.
- [Best Practices for Securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory) explains least privilege, separate administrative accounts, and secure administrative hosts.

## Checklist

- [ ] CLIENT02 receives DHCP and DNS settings from DC01
- [ ] CLIENT02 clean-build snapshot taken before the domain join
- [ ] CLIENT02 is joined to `lab.internal` and is in `Lab Computers`
- [ ] The four selected RSAT features are installed on CLIENT01
- [ ] Active Directory Users and Computers opens from CLIENT01
- [ ] Group Policy, DHCP, and DNS can be viewed remotely
- [ ] `LAB\amorgan` can sign in to CLIENT02 and access the shared folder
- [ ] The wallpaper and screen lock GPOs apply to CLIENT02

The main lab is complete. Continue to the appendix for snapshot rules, evaluation-license guidance, and troubleshooting help.
