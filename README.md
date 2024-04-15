# Agency Focused Web Components for Geosciences 
<!-- Table of Contents -->
# Table of Contents
- [Introduction](#Introduction)
- [How to use](http://)
- [Test Cases](http://)
- [Community](http://)
- [Feedback](http://)
- [Scalability and To Do's](http://)
- [License](http://)
- [Acknowledgements](http://)
- [References](http://)

# Introduction
 
This project introduces Geo-WC, a versatile, generalized web-based framework designed specifically for geoscience to retrieve up-to-date data from various institutions using different data formats. The Geo-WC utilizes a user-friendly approach, employing a simple HTML declarative syntax to unify information in a consolidated processing interface. The framework provides essential information, including maps, geo-data, observations, alerts, and flood maps, presenting outputs in formats such as maps, graphs, tables, and JSON/CSV.

The generic component integrates **[HydroLang](https://github.com/uihilab/HydroLang)** and CacheManager libraries, with CacheManager utilizing **[the IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)** for data storage, while the map feature incorporates **[the Leaflet library](https://github.com/Leaflet/Leaflet)**.

Example agencies such as USGS, FEMA, EPA, NWS, and EAUK, each serving different purposes and providing services in different data types, have been added to the application. 

# How to use

Please download the library and run index.html. If a new html file should be created, the javascript library for the relevant agency should be loaded onto the file as a script. The USGS agency is given as an example. 

```javascript
<script type="module" src="./lib/usgs/usgsComponent.js">
</script>
```
The library for USGS, FEMA, EPA, NWS, and EAUK agencies is readily available in generic form. 

## The definition of an agency 

The definition of an example agency is as follows: 

```javascript
<agencyname-ml service="servicetype"> 
</agencyname-ml>
```
The 'service' parameter, essential for defining an agency, determines the specific service offered by the data provider. 

## Data retrieval

To retrieve data from any source, it is necessary to prepare and transmit specific request information to a web service.

```javascript
<agencyname-ml service="servicetype">
<api-args raw="true" <!-- Parameters of agencies -- > </api-args> 
<api-args startDate="2023-11-01" timeInterval="1d"> </api-args> 
</agencyname-ml>
```
The definition of <api-args> can be done in two different ways. In the case of "raw=true," the parameters of agencies are explicitly written in detail.  In the alternative definition, agencies do not need to specify their parameters explicitly. Default parameters are calculated by the application. 

## Data output

Displaying data in tabular format can be done using the geoweb-table component, which creates an HTML table prompt on screen, as following: 

```javascript
<agencyname-ml service="servicetype">
<api-args startDate="2023-11-01" timeInterval="1d"> </api-args> 
<geoweb-table> </geoweb-table>
</agencyname-ml>
```
To create a map on screen, geoweb-map component, which leverages the Leaflet library is used as following: 

```javascript
<agencyname-ml service="servicetype">
<api-args startDate="2023-11-01" timeInterval="1d"> </api-args> 
<geoweb-map> </geoweb-map>
</agencyname-ml>
```

"geoweb-graph" tag presents the relevant data graphically using the Google Charts library.

```javascript
<agencyname-ml service="servicetype">
<api-args startDate="2023-11-01" timeInterval="1d"> </api-args> 
<geoweb-graph> </geoweb-graph>
</agencyname-ml>
```
 To download data in CSV or JSON formats for all agencies, the geoweb-output component can be used as following: 

```javascript
<agencyname-ml service="servicetype">
<api-args startDate="2023-11-01" timeInterval="1d"> </api-args> 
<geoweb-output type="json"> </geoweb-output>
<geoweb-output type="csv"> </geoweb-output>
</agencyname-ml>
```

## Defining a new agency

A new agency can be easily created using the generic Geo-WC framework. 

- A folder named after the agency to be added (usgs, fema, etc.) is opened under 'lib,' and within that folder, a file named agencyNameComponent.js (e.g., usgsComponent, femaComponent, etc.) is created.

- The components of agencies follow a standard structure. The content of any agency component can be utilized for a new agency component.

- The source and datatype information in the agencynameComponent.js file is updated for the new agency. 

- Agency-specific transformation functions should be prepared.

- In the <head></head> section of the index.html page, the newly created agencyNameComponent.js file is imported.

- The definitions for the agency are made within the <body></body> tags.

- Code snippets suitable for the agency's outputs are written. 

# Test Cases

The usage of the library through its core structure can be found within the following files:

- "test-cases" folder
    - test-output.html
    - test-retrieve.html

# Community

The developed Geo-WC is applicable to entry-level programmers, researchers, and educational environments including high schools and universities, facilitating the process of creating web pages. In terms of governmental and higher-level applications, the features of Geo-WC represent some of the most influential and commonly used in the fields of environmental and hydrological sciences. Developers from different disciplines can integrate their agencies with Geo-WC. This enables greater collaboration that benefits research and education.

# Feedback

Please feel free to send feedback to us on any issues found by filing an **[issue](https://github.com/uihilab/Geo-WC/blob/main/ISSUE_TEMPLATE/feature_request.md)**. 

# Scalability and To Do's

Geo-WC is not limited to the agencies and data types/formats implemented, but rather provides a boilerplate for new features to be added. The Geo-WC framework allows for the development of new subcomponents tailored to various scopes.


- Agencies in different scientific fields will be added to the framework.
- Different data types/formats will be added to the framework.
- Includes a limited set of subcomponents, including a graph, table, export and map. 

# License
This project is licensed under the MIT License - see the  **[LICENSE](https://github.com/uihilab/Geo-WC/blob/main/LICENSE)**  file for details.

# Acknowledgements
This project is developed by  **[the University of Iowa Hydroinformatics Lab (UIHI Lab)](https://hydroinformatics.uiowa.edu/)**
and is supported by **[ Sakarya University](https://cs.sakarya.edu.tr/)**, Turkiye. 














