// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the cheerio object into a variable, `content`
// which holds data and metadata about the html file (written as txt)
var content = fs.readFileSync('data/m08.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

var info = [];

$('td').each(function(i, elem) {
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3; width:260px") {
        const groupName = $(elem).find('b:first').text().replace(/[-\,(].*/g, "");
        const locationName = $(elem).find('h4').text().replace(/[-\,(].*/g, "");
        const addressLine1 = $(elem).text().split('</b><br />')[0].split('</b><br />\t\t\t\t\t\t')[0].split('\n\t\t\t\t\t\t')[1].trim();
        const addressLine2 = $(elem).text().split('</b><br />')[0].split('</b><br />\t\t\t\t\t\t')[0].split('\n\t\t\t\t\t\t')[2].trim();
        const address = addressLine1 + addressLine2;
        const wheelChair= $(elem).text().includes('Wheelchair access');
        const notes = $(elem).text().split('</b><br />')[0].split('</b><br />\t\t\t\t\t\t')[0].split('\n\t\t\t\t\t\t')[4].trim();
        
        info.push({
            GroupName:groupName,Location:locationName,Address:address,WheelChairAccessible:wheelChair,Notes:notes
        })
    }
    
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3;width:350px;") {
        const Meetings = $(elem).text().split('\n                   \t \t\n\t\t\t\t  \t    ')[1].replace(' \n\t\t\t \t\t\t\n                    \t\n                    \t\t\n\t\t\t\t\t','').replace('\n\t\t\t \t\t\t\n                    \t\n                    \t\t\n\t\t\t\t\t','').split('\t\t\t\n                    \t\n                    \t\n\t\t\t\t  \t    ');
        

        info.push({
            Meetings
        })
    }
    
});

console.log(info);
