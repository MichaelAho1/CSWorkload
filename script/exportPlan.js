document.getElementById('exportButton').addEventListener('click', function() {
    const planAsText = JSON.stringify(gradPlan);
    const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(planAsText);

    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "gradPlan.json"; 

    document.body.appendChild(downloadLink);
    downloadLink.click();
});