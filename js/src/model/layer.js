
/**
 * 
 * @param {type} t
 * @param {type} n
 * @param {type} ext
 * @param {type} url
 * @param {type} mtrx
 * @param {type} mres
 * @param {type} pro
 * @param {type} z
 * @param {type} f
 * @param {type} dateFrom
 * @param {type} dateTo
 * @param {type} res
 * @returns {NasaLayer}
 */
function NasaLayer(t, n, ext, url,mtrx,mres,pro,z,f, dateFrom, dateTo,res){
	this.title = t;//Title of the layer
	this.name = n;//Name of the layer
	this.extent = ext;// Extend
	this.wmts = url;// Text summarizing projection and resolution
	this.matrix = mtrx;// Matrix of tilesj
	this.maxRes = mres;// Max resolutions
	this.proj = pro;// Projection
	this.zoom = z;// Number of zooms available for the layer
	this.format = f;// Image format jpg or png
	this.from = dateFrom;
	this.to = dateTo;
	this.resolutions = res;
};