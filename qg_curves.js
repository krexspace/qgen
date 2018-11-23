/*
bool e,e0;
double ang,dang=2.0*M_PI/100.0; // 100 lines per 360 degree
for (e=true,e0=true,ang=0.0;e;ang+=dang,e0=false)
 {
 if (ang>=2.0*M_PI) { ang=2.0*M_PI; e=false; } // reached end? 360 degree
 x = C.x + a.x*cos(ang) + b.x*sin(ang);
 y = C.y + a.y*cos(ang) + b.y*sin(ang);
 if (e0) Canvas->MoveTo(x,y); // first time is cursor moved to (x,y)
  else   Canvas->LineTo(x,y); // all the other iterations just draws a line from last cursor to (x,y) and also moves the cursor there
 }
*/