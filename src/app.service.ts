import { Injectable } from '@nestjs/common';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Promovize</title>
</head>
<body>
  <h1>Promovize</h1>
  <p>Description:</p>
  <p>Introducing Promovize, the ultimate social media management app for startups...</p>
</body>
</html>
`;

@Injectable()
export class AppService {
  // should return the html
  getApp(): string {
    return htmlContent;
  }
}
