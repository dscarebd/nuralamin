export function downloadVCard() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Shariful Islam
N:Islam;Shariful;;;
TITLE:Brand Designer
TEL;TYPE=CELL:+8801754392770
EMAIL:sharif.logohut@gmail.com
URL:https://www.behance.net/shariflogohut
ADR;TYPE=HOME:;;Uttara, Dhaka;;1000;;Bangladesh
ORG:Sharif Logo Hut
END:VCARD`;

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Shariful_Islam.vcf";
  a.click();
  URL.revokeObjectURL(url);
}
