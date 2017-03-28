
function CloudMeasurer(ImageID)
{
    console.log("Cloud const.");
    console.log(ImageID);
    this.ImageID = ImageID;
    this.MaxCloudFrac = 0.15;
    this.hist = {};
    this.ImgSrc = document.getElementById(ImageID).src;
    this.img = new Image();
    this.img.src = this.ImgSrc;

    // Color limits (indices in arrays of dimension=256).
    this.BlackThresh = 25;
    this.WhiteCloudMin = 206;
    this.GrayCloudMax = 150;    
    this.GrayCloudMin = 100;
}


CloudMeasurer.prototype.GetHists = function(PaintHist /*true or false*/) 
{
    console.log(this.img.src);
    console.log(typeof this.hist);
    Pixastic.process(this.img, "colorhistogram", {paint:PaintHist,returnValue:this.hist});

    if (PaintHist)
	// How can I replace the image instead of appending one?
	document.body.appendChild(this.img);
	//document.getElementById(this.ImageID).appendChild(this.img);
};

CloudMeasurer.prototype.GetCloudPercent = function()
{
    var RedEffArea = 0;
    var GreenEffArea = 0;
    var BlueEffArea = 0;
    var EffArea = 0;

    // RGB areas for the white clouds.
    var WhiteCloudR = 0;
    var WhiteCloudG = 0;
    var WhiteCloudB = 0;

    // RGB areas for the gray clouds.
    var GrayCloudR = 0;
    var GrayCloudG = 0;
    var GrayCloudB = 0;

    // Fractions of the image covered by clouds.
    var CloudFrac = 0;
    var WhiteCloudFrac = 0;
    var GrayCloudFrac = 0;

    for( var i=this.BlackThresh; i<256; i++)  {
	RedEffArea += this.hist.rvals[i]; 
	GreenEffArea += this.hist.gvals[i]; 
	BlueEffArea += this.hist.bvals[i]; 
	EffArea += this.hist.rvals[i] + this.hist.gvals[i] + this.hist.bvals[i];
	if (i>this.WhiteCloudMin) {
	    WhiteCloudR += this.hist.rvals[i]; 
	    WhiteCloudG += this.hist.gvals[i]; 
	    WhiteCloudB += this.hist.bvals[i]; 
	}
	if (i>=this.GrayCloudMin && i<=this.GrayCloudMax) {
	    GrayCloudR += this.hist.rvals[i]; 
	    GrayCloudG += this.hist.gvals[i]; 
	    GrayCloudB += this.hist.bvals[i]; 
	}
    }
    //    CloudFrac = WhiteCloudR/RedEffArea + WhiteCloudG/GreenEffArea + WhiteCloudB/BlueEffArea;
    WhiteCloudFrac = (WhiteCloudR + WhiteCloudG + WhiteCloudB)/EffArea;
    GrayCloudFrac = (GrayCloudR + GrayCloudG + GrayCloudB)/EffArea;
    CloudFrac = WhiteCloudFrac + GrayCloudFrac;
    console.log("Eff. areas: " + RedEffArea + " " + GreenEffArea + " " + BlueEffArea);
    console.log("White cloud areas: " + WhiteCloudR + " " + WhiteCloudG + " " + WhiteCloudB);
    console.log("Gray cloud areas: " + GrayCloudR + " " + GrayCloudG + " " + GrayCloudB);
    console.log("White clouds %: " + WhiteCloudFrac);
    console.log("Gray clouds %: " + GrayCloudFrac);
    
    if (CloudFrac>this.MaxCloudFrac)
	alert("Cloudy Day! (cloud frac = " + CloudFrac + ")");
    else
	alert("Sunny Day! (cloud frac = " + CloudFrac + ")");
};
