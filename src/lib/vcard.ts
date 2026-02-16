export function downloadVCard() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Shariful Islam
N:Islam;Shariful;;;
TITLE:Brand Designer
TEL;TYPE=CELL:+8801XXXXXXXXX
EMAIL:shariful@logohut.com
URL:https://logohut.com
ADR;TYPE=HOME:;;Dhaka;;1000;;Bangladesh
ORG:LogoHut
END:VCARD`;

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Shariful_Islam.vcf";
  a.click();
  URL.revokeObjectURL(url);
}
