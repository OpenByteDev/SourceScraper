Get-ChildItem -Path "." -Include "dist" -Recurse -File:$false | Remove-Item -Recurse -Force;
Get-ChildItem -Path "." -Include "types" -Recurse -File:$false | Remove-Item -Recurse -Force;
Get-ChildItem -Path "." -Include "docs" -Recurse -File:$false | Remove-Item -Recurse -Force;
Get-ChildItem -Path "." -Include "node_modules" -Recurse -File:$false | Remove-Item -Recurse -Force;
