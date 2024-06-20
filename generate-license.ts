import { ILicense, getProjectLicenses } from "generate-license-file";
import { writeFileSync } from "fs"; 

const licenses: ILicense[] = (await getProjectLicenses("./package.json"));

writeFileSync('./LICENSE.md', '# Licenses\n', {encoding: 'utf8', flag: 'w'})
writeFileSync('./LICENSE.md', 'This is a license file for all packages in the Quizable Project.', {encoding: 'utf8', flag: 'a'})

for (const license of licenses) {
    const dependenciesString: string = license.dependencies.map(str => `${str}`).join(', ')
    const licenseContent = license.content
    // console.log(licenseContent)

    writeFileSync('./LICENSE.md', 
`
<details>
<summary><b><font size="+1">${dependenciesString}</font></b></summary>
${licenseContent}
</details>
`,
    {encoding: 'utf8', flag: 'a'})
}






