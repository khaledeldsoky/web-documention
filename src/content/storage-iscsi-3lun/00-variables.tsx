import Section from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import VariablesTable from "@/components/docs/VariablesTable";

export function Section0() {
  return (
    <Section id="variables" num={0} title="Variables">
      <Prose>
        Fill in your environment values before you start. Every amber-highlighted
        variable is reused throughout the guide — commands, configs, and tables
        all reference these. Change them first, then proceed.
      </Prose>
      <VariablesTable
        course="storage-iscsi-3lun"
        columns={[
          { header: "Category", key: "cat" },
          { header: "Variable", key: "var" },
          { header: "Value", key: "val" },
          { header: "Example", key: "cmd" },
        ]}
        rows={[
          { cat: "Array", var: "ARRAY_MODEL", val: "<ARRAY_MODEL>", cmd: "Dell EMC ME4024" },
          { cat: "Array", var: "DISK_GROUP", val: "<DISK_GROUP>", cmd: "xdr-dg1" },
          { cat: "Array", var: "CTRL_A_IP", val: "<CTRL_A_IP>", cmd: "10.10.20.1 (Controller A iSCSI portal)" },
          { cat: "Array", var: "CTRL_B_IP", val: "<CTRL_B_IP>", cmd: "10.10.20.2 (Controller B iSCSI portal)" },
          { cat: "LUNs", var: "LUN_NAME_1", val: "<LUN_NAME_1>", cmd: "xdr-data-1" },
          { cat: "LUNs", var: "LUN_NAME_2", val: "<LUN_NAME_2>", cmd: "xdr-data-2" },
          { cat: "LUNs", var: "LUN_NAME_3", val: "<LUN_NAME_3>", cmd: "xdr-data-3" },
          { cat: "LUNs", var: "LUN_SIZE", val: "<LUN_SIZE>", cmd: "20 TB" },
          { cat: "Nodes", var: "NODE_1", val: "<NODE_1>", cmd: "heavy-1" },
          { cat: "Nodes", var: "NODE_2", val: "<NODE_2>", cmd: "heavy-2" },
          { cat: "Nodes", var: "NODE_3", val: "<NODE_3>", cmd: "heavy-3" },
          { cat: "Network", var: "STORAGE_NIC", val: "<STORAGE_NIC>", cmd: "ens192 (run ip a to find it)" },
          { cat: "Network", var: "NODE_1_IP", val: "<NODE_1_IP>", cmd: "10.10.20.11" },
          { cat: "Network", var: "NODE_2_IP", val: "<NODE_2_IP>", cmd: "10.10.20.12" },
          { cat: "Network", var: "NODE_3_IP", val: "<NODE_3_IP>", cmd: "10.10.20.13" },
          { cat: "Network", var: "STORAGE_VLAN", val: "<STORAGE_VLAN>", cmd: "20" },
          { cat: "iSCSI", var: "IQN_DATE", val: "<IQN_DATE>", cmd: "2026-04" },
          { cat: "iSCSI", var: "IQN_DOMAIN", val: "<IQN_DOMAIN>", cmd: "net.agency" },
          { cat: "iSCSI", var: "CHAP_USER", val: "<CHAP_USER>", cmd: "initiator-user (from password vault)" },
          { cat: "iSCSI", var: "CHAP_PASS", val: "<CHAP_PASS>", cmd: "CHAP-password (from password vault)" },
          { cat: "iSCSI", var: "LUN_1_WWID", val: "<LUN_1_WWID>", cmd: "3600c0ff... (from scsi_id in B6)" },
          { cat: "iSCSI", var: "LUN_2_WWID", val: "<LUN_2_WWID>", cmd: "3600c0ff... (from scsi_id in B6)" },
          { cat: "iSCSI", var: "LUN_3_WWID", val: "<LUN_3_WWID>", cmd: "3600c0ff... (from scsi_id in B6)" },
          { cat: "Storage", var: "VG_1", val: "<VG_1>", cmd: "xdr_vg_1" },
          { cat: "Storage", var: "VG_2", val: "<VG_2>", cmd: "xdr_vg_2" },
          { cat: "Storage", var: "VG_3", val: "<VG_3>", cmd: "xdr_vg_3" },
          { cat: "Storage", var: "LV_1", val: "<LV_1>", cmd: "xdr_lv_1" },
          { cat: "Storage", var: "LV_2", val: "<LV_2>", cmd: "xdr_lv_2" },
          { cat: "Storage", var: "LV_3", val: "<LV_3>", cmd: "xdr_lv_3" },
          { cat: "Storage", var: "MOUNT_BASE", val: "<MOUNT_BASE>", cmd: "/srv/xdr" },
          { cat: "Storage", var: "APP_UID", val: "<APP_UID>", cmd: "10001" },
          { cat: "Kubernetes", var: "MASTER_NODE", val: "<MASTER_NODE>", cmd: "master-1" },
        ]}
      />
    </Section>
  );
}
