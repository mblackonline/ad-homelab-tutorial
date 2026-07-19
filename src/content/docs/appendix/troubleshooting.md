---
title: Troubleshooting
description: Diagnose problems involving VirtualBox, networking, DNS, domain joins, and Group Policy.
---

If the lab is not working as expected, start by checking four basic conditions: the required VMs are running, every VM is attached to the ADLab network, each client received the expected IP settings, and each client uses DC01 for DNS.

Start with the checks below before changing roles, deleting objects, or restoring snapshots.

## Check the Basics in Order

1. Confirm DC01 is running and has finished booting.
2. Confirm every running VM is attached to the **ADLab** NAT Network, not plain NAT.
3. On the affected client, run:

   ```text
   ipconfig /all
   ```

4. Confirm the client has:
   - IPv4 address from 10.0.10.100 through 10.0.10.200
   - Default gateway 10.0.10.1
   - DHCP server 10.0.10.10
   - DNS server 10.0.10.10 and no other DNS server
5. Test the DC's address and DNS record:

   ```text
   ping 10.0.10.10
   nslookup dc01.lab.internal
   ```

6. Test an internet name:

   ```text
   nslookup www.microsoft.com
   ```

A failed ping can be caused by a firewall, so a successful DNS lookup is stronger evidence that DC01 is reachable. The first failed check helps narrow down which layer to investigate.

## A VM Will Not Start

### Virtualization Is Unavailable

Open **Task Manager > Performance > CPU** on the host and confirm **Virtualization: Enabled**. If it is disabled, enable Intel VT-x or AMD-V in the host's BIOS/UEFI as described in Module 1, then fully restart the host.

If VirtualBox still reports a VT-x, AMD-V, or hypervisor error, record the exact message and update VirtualBox before changing Windows security features. Current VirtualBox versions can coexist with many Windows virtualization features, although performance may be slower. Do not disable host security features based only on a generic internet fix.

### Windows 11 Says the PC Does Not Meet Requirements

Power off the client and check **VirtualBox Settings > System**:

- EFI enabled
- TPM set to v2.0
- Secure Boot enabled
- At least 4096 MB RAM during installation
- At least a 64 GB virtual disk

VirtualBox only displays Secure Boot after EFI is enabled.

### The VM Does Not Boot from the ISO

Confirm the ISO is attached to the virtual optical drive. Start the VM, click inside its window, and press a key as soon as **Press any key to boot from CD or DVD** appears.

## The Client Has a 169.254 Address

An address beginning with 169.254 means the client received no DHCP response.

1. Confirm DC01 is running.
2. In VirtualBox, confirm DC01 and the client both use **NAT Network: ADLab** and **Cable Connected** is checked.
3. In VirtualBox's NAT Network settings, confirm its built-in DHCP server is disabled.
4. On DC01, open **Server Manager > Tools > DHCP**.
5. Confirm the server is authorized and the `Lab Network` scope is active with a green icon.
6. On the client, run:

   ```text
   ipconfig /release
   ipconfig /renew
   ipconfig /all
   ```

If the client gets a 10.0.10.x address but lists the wrong DHCP or DNS server, VirtualBox DHCP may still be enabled. Disable it, then release and renew the address again.

## The Client Has No Internet

First run both lookups:

```text
nslookup dc01.lab.internal
nslookup www.microsoft.com
```

- If neither works, check the client's network attachment and confirm its DNS server is 10.0.10.10.
- If the DC lookup works but the internet lookup fails, check the DNS forwarder on DC01 under **DNS Manager > DC01 Properties > Forwarders**. This guide uses 8.8.8.8.
- If both names resolve but websites do not open, confirm the client's gateway is 10.0.10.1 and Adapter 1 uses ADLab.

After correcting DNS, clear the client's cached results:

```text
ipconfig /flushdns
```

Do not add 8.8.8.8 directly to a domain client. Clients must send all DNS requests to DC01 so they can find Active Directory. DC01 forwards internet questions on their behalf.

## Domain Join Fails

DNS is the first check, even if the error message does not mention DNS.

On the client, confirm `ipconfig /all` lists only 10.0.10.10 for DNS. Then run:

```text
nslookup dc01.lab.internal
nslookup -type=SRV _ldap._tcp.dc._msdcs.lab.internal
```

The first command should return 10.0.10.10. The second should identify DC01 as a domain controller.

Also check:

- The domain name is exactly `lab.internal`.
- The join credentials are `LAB\Administrator` and the correct password.
- The client is running Windows 11 Enterprise, not Home.
- The client and DC clocks are within a few minutes of each other. Kerberos authentication rejects large time differences.

If the time is wrong, correct the client's date, time, and time zone, then retry the join. Do not delete the DC's DNS zone or recreate the domain to fix a client join failure.

## Domain Sign-In Fails

Use **Other user** and enter the account with its domain prefix, such as `LAB\amorgan`. A first-time domain sign-in requires DC01 to be reachable. Cached sign-in only works after that user has signed in successfully at least once.

If Windows says no logon servers are available, check DC01, the ADLab network, and client DNS. If the password is rejected, reset it in Active Directory Users and Computers and try the new password.

### The Trust Relationship Failed

Restoring DC01 and a client to mismatched snapshots can cause this error. Restore matching checkpoints as described in [Snapshot Strategy](/appendix/snapshots/).

If you do not have matching snapshots:

1. Sign in to the client with its local account using `.\localadmin`.
2. Confirm networking and DNS work.
3. Use `sysdm.cpl` to move the client temporarily to a workgroup.
4. Restart, then join `lab.internal` again with `LAB\Administrator` credentials.
5. Move the recreated computer object back into **Lab Computers** if needed.

## The Shared Folder Does Not Open

First distinguish the errors:

- **Network path not found** directs you toward name resolution, networking, or the server hosting the share.
- **Access denied** directs you toward group membership and folder permissions.

While signed in as Alex, test the exact path:

```text
\\DC01\LabShare
```

Then run:

```text
whoami
whoami /groups
```

Confirm the account is `lab\amorgan` and the group list includes `GG-LabShare-Editors` and `DL-LabShare-Modify`. If Alex was just added to a group, sign out completely and sign back in. Locking and unlocking does not create a new security token.

On DC01, confirm:

- Alex is a member of `GG-LabShare-Editors`
- `GG-LabShare-Editors` is a member of `DL-LabShare-Modify`
- `DL-LabShare-Modify` has **Change** and **Read** on the Sharing permissions
- `DL-LabShare-Modify` has **Modify** on the Security tab

Jamie should receive Access denied because `jchen` was deliberately left out of the group.

## Group Policy Does Not Apply

Run this on the affected client:

```text
gpupdate /force
```

Then check the correct policy scope:

```text
gpresult /scope user /r
gpresult /scope computer /r
```

The computer command requires an administrator Command Prompt.

Confirm these placements in Active Directory and Group Policy Management:

- Alex is in **Lab Users**.
- CLIENT01 and CLIENT02 are in **Lab Computers**.
- `Lab - Desktop Wallpaper` is linked to Lab Users.
- `Lab - 10 Minute Screen Lock` is linked to Lab Computers.

For the wallpaper, confirm this path opens from the client:

```text
\\lab.internal\SYSVOL\lab.internal\scripts\lab-wallpaper.jpg
```

Sign out and back in after a user-policy refresh. Restart the client after a computer-policy refresh if necessary.

## RSAT Will Not Install or Connect

RSAT optional features download from Microsoft. Confirm CLIENT01 can resolve and open internet sites before retrying the installation.

If a console opens but cannot find DC01:

1. Confirm CLIENT01 uses only 10.0.10.10 for DNS.
2. Test `nslookup dc01.lab.internal`.
3. Connect using `dc01.lab.internal` instead of only `DC01`.
4. Confirm you launched the tool with `LAB\Administrator` credentials.

For example:

```text
runas /user:LAB\Administrator "mmc.exe dsa.msc"
```

If Active Directory tools work but DHCP or DNS does not appear automatically, use **Add Server** or **Connect to DNS Server** inside that console.

## The Lab Is Very Slow

- Run DC01 with only one client at a time.
- On an 8 GB host, assign 3072 MB to DC01 and 3072 MB to the active client.
- Close browsers, games, and other memory-heavy host applications.
- Keep each VM at 2 virtual CPUs. Assigning every host CPU can make performance worse.
- Store the VMs on an SSD and check that the host has free disk space.
- Shut down unused VMs instead of leaving them in a saved state.
- Remove obsolete snapshots through VirtualBox if their disk chains have grown large.

If window resizing, mouse integration, or clipboard sharing stops working, reinstall Guest Additions inside that VM using **Devices > Insert Guest Additions CD image**, then restart it.

## A VM Shuts Down Every Hour

The evaluation license is either unactivated or expired. Open an administrator Command Prompt and run:

```text
slmgr.vbs /xpr
slmgr.vbs /dlv
```

Follow [Extending the Evaluation Licenses](/appendix/eval-rearm/) if a rearm remains. If the count is zero, rebuild the VM from current evaluation media or use a properly licensed Windows edition.

## DC01 Still Has Problems

On DC01, open an administrator Command Prompt and run:

```text
dcdiag
dcdiag /test:dns
```

Read the failed test names before changing anything. Also check **Event Viewer > Windows Logs > System** and **Directory Service** for errors at the time the problem began.

If DC01 worked at the end of the previous module and the failure followed a known change, restoring the last verified snapshot may be faster and safer than making several untracked repairs.

## Before Asking for Help

Record:

- The exact error message
- Which VM and module you were working on
- The last change made before the problem appeared
- Output from `ipconfig /all`
- Results of the internal and internet `nslookup` tests
- Relevant `gpresult` output for a Group Policy problem
- The latest matching snapshots available

Specific symptoms and command output make troubleshooting much faster than a general description such as "the domain does not work."
