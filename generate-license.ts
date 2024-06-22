import { ILicense, getProjectLicenses } from "generate-license-file";
import { writeFileSync } from "fs"; 

const licenses: ILicense[] = (await getProjectLicenses("./package.json"));

export const alphabeticalSorter = (a: string, b: string): number => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
}

// sort the licenses array alphabetically
licenses.sort((a, b) => {
    const dependenciesStringA: string = a.dependencies.map(str => `${str}`).sort((a, b) => alphabeticalSorter(a, b)).join(', ')
    const dependenciesStringB: string = b.dependencies.map(str => `${str}`).sort((a, b) => alphabeticalSorter(a, b)).join(', ')
    return alphabeticalSorter(dependenciesStringA, dependenciesStringB)
})

writeFileSync('./LICENSE.md', '# Licenses\n', {encoding: 'utf8', flag: 'w'})
writeFileSync('./LICENSE.md', 'This is a license file for all packages in the Quizable Project. Regarding the Quizable project itself, the default copyright laws apply.', {encoding: 'utf8', flag: 'a'})

for (const license of licenses) {
    const dependenciesString: string = license.dependencies.map(str => `${str}`).sort((a, b) => alphabeticalSorter(a, b)).join(', ')
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






