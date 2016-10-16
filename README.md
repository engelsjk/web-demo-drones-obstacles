# web-demo-drones-obstacles

Drone Obstacles

![Alt text](/screenshot.png?raw=true "Drone Obstacles")

WHAT IS IT
==========
This demo is a simple Leaflet map of all recorded FAA obstacles greater than 200 feet above ground in the state of Oregon. Filter different obstacle types (power lines, lighthouses, wind turbines, etc) by clicking on the various icons on the left. Zoom out to see all of the obstacles in the state of Oregon. Click on an obstacle icon on the map to see more information (actual height, coordinates, markings/lighting, etc).

MOTIVATION
==========

Working in the wind industry, you get used to working with large obstacles. With modern wind turbines and meteorological towers easily exceeding 250 feet, it's no surprise that the FAA plays a large role in the wind industry in terms of keeping our airspace safe for aviators. To do this, the FAA maintains a Digital Obstacle File (DOF) which is a record of all obstacles over 200 feet above ground level. The DOF is an interesting dataset which tracks tall structures such as wind turbines, bridges, power plants, even tall trees.

One area that could benefit from this dataset is the growing use of commercial drone operations. With current FAA regulations allowing drone operations up to a maximum altitude of 400 feet above the ground, a dataset of obstacles taller than 200 feet above ground could aid drone operators in the development of safe flight plans. 

FUTURE IDEAS
==========

<ul>
<li>Include DOF data from all states in the US.</li>
<li>Automate obstacle data updates by scraping the DOF file from the FAA website.</li>
<li>Offload DOF data from client to server; only show obstacle markers for current map region.</li>
</ul>


REFERENCES
==========

Obstruction Evaluation / Airport Airspace Analysis (OE/AAA): https://oeaaa.faa.gov/oeaaa/external/portal.jsp
FAA Digital Obstacle File: https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dof/
