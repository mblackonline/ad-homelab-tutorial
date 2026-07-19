---
title: "Module 4: Promote to Domain Controller"
description: Install Active Directory Domain Services and create your first forest.
---

This is the module where the lab becomes an Active Directory lab. You will install the Active Directory Domain Services (AD DS) role on DC01 and promote it to a domain controller, creating a brand new domain.

## In This Module

- Install the Active Directory Domain Services role
- Choose a domain name for your lab (and why the name matters)
- Promote DC01 to a Domain Controller, creating a new forest
- Verify DNS is working
- Take a snapshot

## A Few Terms First

- **Domain:** a group of computers and users managed together under one set of accounts and rules. Your lab domain will contain DC01 and the clients you build later.
- **Domain Controller (DC):** a server that stores the domain's database of users, computers, and passwords, and answers login requests. DC01 becomes one in this module.
- **Forest:** the top-level container in Active Directory. A forest can hold many domains, but most small networks (and this lab) have exactly one.
- **DNS:** the service that translates names into IP addresses. Active Directory also uses DNS to help computers find a domain controller.

## Choose a Domain Name

This guide uses **`lab.internal`**.

The name matters because changing an Active Directory domain name later is difficult. Two quick rules:

- Do not use a public domain name you do not own, such as `mycompany.com`. Your lab DNS would treat itself as responsible for that name, which could prevent lab machines from reaching the real public domain.
- Do not use `.local`. That ending is reserved for Multicast DNS (mDNS), so using it for Active Directory can create name-resolution conflicts.

Organizations commonly use a subdomain of a public domain they own, such as `ad.example.com`. For a standalone lab, `.internal` is a good alternative because ICANN permanently reserved it from use in the public DNS root for private applications. That means `lab.internal` will not become a public internet domain. If you prefer a different first part, such as `homelab.internal`, substitute that name everywhere this guide uses `lab.internal`.

## Install the AD DS Role

1. On DC01, open **Server Manager** (it usually opens at login; otherwise it is in the Start menu).
2. Click **Manage > Add Roles and Features**.
3. Click Next through the first screens, keeping the defaults (Role-based installation, DC01 selected as the destination).
4. On the Server Roles screen, check **Active Directory Domain Services**. A window pops up asking to add required features. Click **Add Features**.
5. Click Next through the remaining screens and click **Install**. You can close the wizard while it runs. Wait for the installation to finish.

Installing the role only copies the software onto the server. DC01 is not a domain controller until the next step.

## Promote DC01 to a Domain Controller

1. In Server Manager, click the **yellow warning flag** near the top right and choose **Promote this server to a domain controller**.
2. Select **Add a new forest** and enter the root domain name: `lab.internal`. Click Next.
3. On the Domain Controller Options screen:
   - Set both the forest and domain functional levels to **Windows Server 2025**. They may already be selected.
   - Leave **DNS server** and **Global Catalog (GC)** checked. The first domain controller needs both roles.
   - Set a strong **DSRM password** and store it securely. This recovery password is separate from your Administrator password.
4. Click Next. A warning may say that a delegation for this DNS server cannot be created. This is expected because the lab has no parent DNS zone above `lab.internal`. Continue to the next screen.
5. The NetBIOS name defaults to **LAB**. Keep it and click Next.
6. Keep the default folder paths and click Next.
7. Review the summary and run the prerequisites check. The DNS delegation warning may remain, but resolve any errors or other unexpected warnings before continuing. Click **Install** when the check passes.
8. The server reboots itself when the promotion finishes.

After the reboot, the login screen shows **LAB\Administrator**. Use the same Administrator password as before. The `LAB\` prefix identifies the new domain.

## Verify DNS Is Working

The promotion installed DNS on DC01. Because this is the first and only domain controller, DC01 should use its own IP address for DNS.

Open Command Prompt and run:

```text
ipconfig /all
```

Under the Ethernet adapter, confirm that **DNS Servers** lists `10.0.10.10`. If it still lists the temporary `8.8.8.8` address from Module 3:

1. Open **Settings > Network & internet > Ethernet**.
2. Next to IP assignment, click **Edit**.
3. Leave the IP address, subnet mask, and gateway unchanged, but replace Preferred DNS with `10.0.10.10`.
4. Save the change and restart DC01.

Now confirm that the domain's DNS record exists:

```text
nslookup dc01.lab.internal
```

The answer should contain `10.0.10.10`. That confirms the domain's DNS zone exists and DC01 registered itself in it.

Now test an internet name:

```text
ping google.com
```

If this works too, you are done with this section. If internet names fail but `nslookup dc01.lab.internal` works, add a forwarder:

1. Open **Server Manager > Tools > DNS**.
2. Expand DC01, right-click it, and choose **Properties**.
3. On the **Forwarders** tab, click **Edit**, add `8.8.8.8`, and click OK twice.
4. Test `ping google.com` again.

A forwarder tells your DNS server where to send questions it cannot answer itself. DC01 answers everything about `lab.internal` on its own and passes internet lookups upstream.

## Take a Snapshot

Shut down DC01 from inside Windows, then in VirtualBox Manager take a snapshot named `Domain controller - lab.internal`.

## Further Learning

These optional references provide more detail from the organizations responsible for Active Directory and DNS standards:

- [Active Directory Domain Services Overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) explains the directory, domains, forests, domain controllers, and other core AD DS components.
- [AD DS Configuration Wizard Page Descriptions](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/ad-ds-installation-and-removal-wizard-page-descriptions) explains each promotion screen and why its settings matter.
- [DNS Client Settings for Domain Controllers](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/best-practices-for-dns-client-settings) documents Microsoft's recommendation that the first and only domain controller use its own IP address for DNS.
- [DNS Forwarding in Windows Server](https://learn.microsoft.com/en-us/windows-server/networking/dns/forwarding) explains how Windows DNS handles names it cannot answer locally.
- [ICANN's `.internal` Resolution](https://www.icann.org/en/board-activities-and-meetings/materials/approved-resolutions-special-meeting-of-the-icann-board-29-07-2024-en) records the permanent reservation of `.internal` for private-use applications.
- [RFC 6762: Multicast DNS](https://www.rfc-editor.org/info/rfc6762) explains the special use of `.local` names by mDNS.

## Checklist Before Moving On

- [ ] Login screen shows LAB\Administrator
- [ ] `ipconfig /all` lists 10.0.10.10 as DC01's DNS server
- [ ] `nslookup dc01.lab.internal` returns 10.0.10.10
- [ ] `ping google.com` works
- [ ] Snapshot taken

Continue to Module 5 to set up DHCP so client machines can get addresses automatically.
